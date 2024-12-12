from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pandas as pd
from flask_cors import CORS


# Inicializar o app Flask
app = Flask(__name__)
CORS(app)

# Carregar o modelo Keras
model = tf.keras.models.load_model("model.keras")

# Carregar os encorers salvos
encoders = joblib.load("encoders.pkl")

# Carregar o scaler salvo
scaler = joblib.load("scaler.pkl")

def categorize(data):
    for column in ['provider', 'usecase']:
        data[column] = encoders[column].transform(data[column])
    return data

def decategorize(data):
    for column, label_encoder in encoders.items():
        data[column] = label_encoder.inverse_transform(data[column].astype(int))    
    return data

def normalize(data):
    normalized_data = data.copy()
    columns_to_normalize = [col for col in data.columns]
    normalized_data[columns_to_normalize] = scaler.transform(data[columns_to_normalize])
    return normalized_data

def denormalize(normalized_data):
    original_data = normalized_data.copy()
    original_data[normalized_data.columns] = scaler.inverse_transform(normalized_data[normalized_data.columns])
    return original_data
        
# Rota para previsão
@app.route('/predict_latency', methods=['POST'])
def predict_latency():
    try:
        data = request.json
        expected_fields = [
            "success",
            "concurrency", 
            "provider", 
            "usecase",
            "total_operands", 
            "distinct_operands",
            "total_operators", 
            "distinct_operators", 
            "time", 
            "bugs", 
            "effort",
            "volume", 
            "difficulty", 
            "vocabulary", 
            "length"
        ]

        if not all(field in data for field in expected_fields):
            return jsonify({"error": "Missing fields in input data"}), 400
        
        df = pd.DataFrame([data])       
        data = categorize(df)
        data["Latency"] = 0
        data = normalize(data)
        data = data.drop(columns=['Latency'])

        # Convert data to array NumPy
        input_data = np.array([[data[field] for field in expected_fields]], dtype=float)
        
        # Predict
        data["predicted_latency"] = model.predict(input_data)[0][0]
        result = denormalize(data)
        result = decategorize(result)
        result = result.drop(columns=[  "success",
                                        "total_operands", 
                                        "distinct_operands",
                                        "total_operators", 
                                        "distinct_operators", 
                                        "time", 
                                        "bugs", 
                                        "effort",
                                        "volume", 
                                        "difficulty", 
                                        "vocabulary", 
                                        "length"])
        simple_result = {}
        for i in result:
            simple_result[i] = result[i][0]
        return simple_result
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/convert_code', methods=['POST'])
def convert_code():
    data = request.json
    expected_fields = [
        "source-code",
    ]        
    if not all(field in data for field in expected_fields):
        return jsonify({"error": "Missing fields in input data"}), 400
    
    return {"ok":"ok"}

# Inicializar o servidor
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
