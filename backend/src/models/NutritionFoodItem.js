import mongoose from 'mongoose';

const nutritionFoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  proteinGrams: { type: Number, required: true },
  carbGrams: { type: Number, required: true },
  fatGrams: { type: Number, required: true },
  category: { type: String, required: true },
  dietaryCategory: { type: String, required: true }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id ? ret._id.toString() : (ret.id || (doc && (doc.id || (doc._id ? doc._id.toString() : ''))) || '');
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id ? ret._id.toString() : (ret.id || (doc && (doc.id || (doc._id ? doc._id.toString() : ''))) || '');
      delete ret.__v;
      return ret;
    }
  }
});

const NutritionFoodItem = mongoose.model('NutritionFoodItem', nutritionFoodItemSchema);
export default NutritionFoodItem;
