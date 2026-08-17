import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from data_preprocessing import load_and_preprocess_data
from evaluate_model import evaluate_classifier

def train_and_save_model(data_path: str, model_save_path: str):
    """
    Trains Random Forest Classifier and saves model, scaler, and label encoder artifact.
    """
    print(f"Loading and preprocessing dataset from {data_path}...")
    X, y, scaler, label_encoder, feature_cols = load_and_preprocess_data(data_path)

    # 1. Stratified 80/20 Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 2. Scale Features
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 3. Train Random Forest Classifier
    print("Training Random Forest Classifier model...")
    model = RandomForestClassifier(
        n_estimators=150, 
        max_depth=10, 
        random_state=42, 
        class_weight='balanced'
    )
    model.fit(X_train_scaled, y_train)

    # 4. Evaluate Model
    metrics = evaluate_classifier(model, X_test_scaled, y_test, label_encoder)

    # 5. Serialize Artifacts
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)
    artifact = {
        'model': model,
        'scaler': scaler,
        'label_encoder': label_encoder,
        'feature_cols': feature_cols,
        'metrics': metrics
    }
    joblib.dump(artifact, model_save_path)
    print(f"[SUCCESS] Trained model successfully saved to {model_save_path}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_file = os.path.join(base_dir, 'data', 'gym_members_exercise_tracking.csv')
    model_file = os.path.join(base_dir, 'models', 'workout_model.pkl')
    train_and_save_model(data_file, model_file)
