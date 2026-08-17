from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def evaluate_classifier(model, X_test, y_test, label_encoder):
    """
    Evaluates trained classification model and prints key performance metrics.
    """
    y_pred = model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted')
    rec = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    cm = confusion_matrix(y_test, y_pred)
    
    print("\n==================================================")
    print("      MODEL EVALUATION PERFORMANCE METRICS       ")
    print("==================================================")
    print(f"Accuracy Score:   {acc:.4f} ({acc * 100:.2f}%)")
    print(f"Precision:        {prec:.4f}")
    print(f"Recall:           {rec:.4f}")
    print(f"F1-Score:         {f1:.4f}")
    print("\nConfusion Matrix:")
    print(cm)
    print("==================================================\n")
    
    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "confusion_matrix": cm.tolist()
    }
