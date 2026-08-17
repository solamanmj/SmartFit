import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder

FEATURE_COLUMNS = [
    'Age', 
    'Gender', 
    'Weight (kg)', 
    'Height (m)', 
    'BMI', 
    'Resting_BPM', 
    'Fat_Percentage', 
    'Workout_Frequency (days/week)', 
    'Experience_Level'
]

TARGET_COLUMN = 'Workout_Type'

def load_and_preprocess_data(csv_path: str):
    """
    Loads raw gym tracking dataset, handles feature encoding, scaling, and train/test preparation.
    """
    df = pd.read_csv(csv_path)

    # 1. Clean & Encode Gender (Male -> 1, Female -> 0)
    df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})
    if df['Gender'].isnull().any():
        df['Gender'] = df['Gender'].fillna(1)

    # 2. Extract X (Features) and y (Target)
    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].copy()

    # 3. Label encode Target
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    # 4. Feature Scaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    return X, y_encoded, scaler, label_encoder, FEATURE_COLUMNS
