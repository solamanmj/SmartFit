import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target Atlas MongoDB URIs
const ATLAS_SRV_URI = process.env.MONGODB_URI || 'mongodb+srv://solamanmj009_db_user:Yv1XE8EZsd54OlHx@cluster0.iimcb7m.mongodb.net/smartfit_db?retryWrites=true&w=majority';
const ATLAS_DIRECT_URI = 'mongodb://solamanmj009_db_user:Yv1XE8EZsd54OlHx@ac-aqg2xsf-shard-00-00.iimcb7m.mongodb.net:27017,ac-aqg2xsf-shard-00-01.iimcb7m.mongodb.net:27017,ac-aqg2xsf-shard-00-02.iimcb7m.mongodb.net:27017/smartfit_db?ssl=true&replicaSet=atlas-d5o17u-shard-0&authSource=admin&retryWrites=true&w=majority';

// Source Local Compass MongoDB URI
const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/smartfit_db';
const DATABASE_JSON_PATH = path.join(__dirname, '..', 'data', 'database.json');

async function connectToAtlas() {
  console.log('[1/4] Connecting to MongoDB Atlas...');
  try {
    const client = new MongoClient(ATLAS_SRV_URI);
    await client.connect();
    console.log(' -> Connected successfully to MongoDB Atlas via SRV!');
    return client;
  } catch (srvErr) {
    console.warn(' -> SRV connection note:', srvErr.message);
    console.log(' -> Attempting direct replicaSet connection...');
    const client = new MongoClient(ATLAS_DIRECT_URI);
    await client.connect();
    console.log(' -> Connected successfully to MongoDB Atlas via direct replicaSet!');
    return client;
  }
}

async function connectToLocalMongo() {
  console.log('[2/4] Connecting to Local Compass MongoDB (127.0.0.1:27017)...');
  try {
    const client = new MongoClient(LOCAL_MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    await client.connect();
    console.log(' -> Connected successfully to Local MongoDB!');
    return client;
  } catch (err) {
    console.warn(' -> Local MongoDB connection error:', err.message);
    return null;
  }
}

async function runMigration() {
  console.log('=====================================================');
  console.log('     SmartFit: Compass to MongoDB Atlas Migration     ');
  console.log('=====================================================');

  const atlasClient = await connectToAtlas();
  const atlasDb = atlasClient.db('smartfit_db');

  const localClient = await connectToLocalMongo();
  let localDb = null;
  if (localClient) {
    localDb = localClient.db('smartfit_db');
  }

  // Load database.json if available
  let fileDb = {};
  if (fs.existsSync(DATABASE_JSON_PATH)) {
    try {
      fileDb = JSON.parse(fs.readFileSync(DATABASE_JSON_PATH, 'utf8'));
      console.log(' -> Loaded local database.json storage backup.');
    } catch (e) {
      console.warn(' -> Could not parse database.json:', e.message);
    }
  }

  console.log('\n[3/4] Migrating collections to MongoDB Atlas...');

  const migrationStats = {};

  // 1. Migrate all collections from Local Compass MongoDB
  if (localDb) {
    const collections = await localDb.listCollections().toArray();
    for (const colInfo of collections) {
      const colName = colInfo.name;
      const localCol = localDb.collection(colName);
      const atlasCol = atlasDb.collection(colName);

      const docs = await localCol.find({}).toArray();
      if (docs.length > 0) {
        for (const doc of docs) {
          const filter = { _id: doc._id };
          await atlasCol.replaceOne(filter, doc, { upsert: true });
        }
        migrationStats[colName] = docs.length;
        console.log(` -> Migrated ${docs.length} docs from local MongoDB collection: '${colName}'`);
      } else {
        migrationStats[colName] = 0;
      }
    }
  }

  // 2. Merge and Upsert data from database.json (including any newer client accounts like Aibal Jose, Anugrah, etc.)
  console.log('\n -> Merging and syncing persistent data from database.json...');

  // Helper function to safely upsert documents into Atlas
  async function mergeCollection(atlasCollectionName, items, uniqueKey = '_id') {
    if (!Array.isArray(items) || items.length === 0) return 0;
    const col = atlasDb.collection(atlasCollectionName);
    let mergedCount = 0;

    for (const item of items) {
      const doc = { ...item };
      let filter = {};
      if (uniqueKey === 'email' && doc.email) {
        filter = { email: doc.email.toLowerCase() };
      } else if (doc._id) {
        filter = { _id: doc._id };
      } else if (doc.id) {
        filter = { id: doc.id };
      } else {
        filter = { ...doc };
      }

      const idVal = doc._id || doc.id || new ObjectId().toString();
      const updateFields = { ...doc };
      delete updateFields._id; // Never include _id in $set to avoid MongoServerError code 66

      await col.updateOne(
        filter,
        { 
          $set: updateFields,
          $setOnInsert: { _id: idVal }
        },
        { upsert: true }
      );
      mergedCount++;
    }

    const totalInAtlas = await col.countDocuments();
    migrationStats[atlasCollectionName] = totalInAtlas;
    console.log(` -> Synced '${atlasCollectionName}': total ${totalInAtlas} documents in Atlas.`);
    return mergedCount;
  }

  // Merge users
  if (fileDb.users && fileDb.users.length > 0) {
    await mergeCollection('users', fileDb.users, 'email');
  }

  // Merge trainers & nutritionists
  if (fileDb.trainers && fileDb.trainers.length > 0) {
    await mergeCollection('trainers', fileDb.trainers, 'email');
  }
  if (fileDb.nutritionists && fileDb.nutritionists.length > 0) {
    await mergeCollection('nutritionists', fileDb.nutritionists, 'email');
  }

  // Merge exercise items
  if (fileDb.exercises && fileDb.exercises.length > 0) {
    await mergeCollection('exercises', fileDb.exercises, 'name');
    await mergeCollection('exerciseitems', fileDb.exercises, 'name');
  }

  // Merge food items
  if (fileDb.foodItems && fileDb.foodItems.length > 0) {
    await mergeCollection('nutrition_foods', fileDb.foodItems, 'name');
    await mergeCollection('nutritionfooditems', fileDb.foodItems, 'name');
  }

  // Merge workout plans & splits
  if (fileDb.workoutPlans && fileDb.workoutPlans.length > 0) {
    await mergeCollection('workoutplans', fileDb.workoutPlans, 'planTitle');
  }
  if (fileDb.workoutSplits && fileDb.workoutSplits.length > 0) {
    await mergeCollection('workoutsplits', fileDb.workoutSplits);
  }

  // Merge meal plans & meal schedules
  if (fileDb.mealPlans && fileDb.mealPlans.length > 0) {
    await mergeCollection('mealplans', fileDb.mealPlans, 'planTitle');
  }
  if (fileDb.mealSchedules && fileDb.mealSchedules.length > 0) {
    await mergeCollection('mealschedules', fileDb.mealSchedules);
  }

  // Merge feedbacks & chat messages
  if (fileDb.feedbacks && fileDb.feedbacks.length > 0) {
    await mergeCollection('feedbacks', fileDb.feedbacks);
    await mergeCollection('feedback', fileDb.feedbacks);
  }
  if (fileDb.chatMessages && fileDb.chatMessages.length > 0) {
    await mergeCollection('chatmessages', fileDb.chatMessages);
  }

  // Create Indexes on Atlas
  console.log('\n -> Creating and verifying collection indexes in Atlas...');
  try {
    await atlasDb.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
    await atlasDb.collection('trainers').createIndex({ email: 1 }, { unique: true, sparse: true });
    await atlasDb.collection('nutritionists').createIndex({ email: 1 }, { unique: true, sparse: true });
  } catch (idxErr) {
    console.warn('Index note:', idxErr.message);
  }

  console.log('\n[4/4] Verifying Final MongoDB Atlas Collections...');
  const finalCols = await atlasDb.listCollections().toArray();
  console.log('-----------------------------------------------------');
  console.log(' Atlas Collection Name       | Total Documents       ');
  console.log('-----------------------------------------------------');
  for (const c of finalCols) {
    const count = await atlasDb.collection(c.name).countDocuments();
    console.log(` ${c.name.padEnd(27)} | ${count.toString().padStart(6)} documents`);
  }
  console.log('-----------------------------------------------------');

  // Clean close
  if (localClient) await localClient.close();
  await atlasClient.close();

  console.log('\n[SUCCESS] Migration from Compass to MongoDB Atlas completed successfully!');
}

runMigration().catch(err => {
  console.error('\n[FATAL] Migration failed:', err);
  process.exit(1);
});
