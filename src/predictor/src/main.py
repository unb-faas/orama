from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
import pandas as pd
from flask_cors import CORS

# Run the app Flask
app = Flask(__name__)
CORS(app)

# Load the model
model = tf.keras.models.load_model("model.keras")

# Load encoders
encoders = joblib.load("encoders.pkl")

# Load scaler
scaler = joblib.load("scaler.pkl")

# Local PCA
pca = joblib.load("pca.pkl")

# Local PCA scaler
pca_scaler = joblib.load("pca_scaler.pkl")

def categorize(data):
    for column in ['provider']:
        data[column] = encoders[column].transform(data[column])
    return data

def decategorize(data):
    for column, label_encoder in encoders.items():
        data[column] = label_encoder.inverse_transform(data[column].astype(int))    
    return data

def normalize(data, columns_to_normalize):
    normalized_data = data.copy()
    normalized_data[columns_to_normalize] = scaler.transform(data[columns_to_normalize])
    return normalized_data

def denormalize(normalized_data, columns_to_normalize):
    denormalized_data = normalized_data.copy()
    denormalized_data[columns_to_normalize] = scaler.inverse_transform(normalized_data[columns_to_normalize])
    return denormalized_data

cols_pca = [
        "total_operands", 
        "distinct_operands", 
        "total_operators", 
        "distinct_operators",
        "time", 
        "bugs", 
        "effort", 
        "volume", 
        #"difficulty", 
        #"vocabulary", 
        #"length"
    ]

def reduce_scale_pca(data):
    # Normalize
    X_scaled = pca_scaler.transform(data[cols_pca])

    # Reduce to 1 component
    principal_components = pca.transform(X_scaled)

    # Add to dataset
    df_pca = pd.DataFrame(principal_components, columns=["PCA1"])
    #df_pca = pd.DataFrame(principal_components, columns=["PCA1"])
    data["Latency"] = 0
    df = data.merge(df_pca, left_index=True, right_index=True)

    return df

def remove_reduced_collumns(data):
    return data.drop(columns=cols_pca, axis=1)

# Route to prediction
@app.route('/predict_latency', methods=['POST'])
def predict_latency():
    try:
        data = request.json
        expected_fields = [
            "success",
            "concurrency", 
            "provider", 
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
        
        # Reduce scale
        data = reduce_scale_pca(data)
        data = remove_reduced_collumns(data)
        columns_to_normalize = [col for col in data.columns]
        data = normalize(data, columns_to_normalize)
        data = data.drop(columns=['Latency'])

        trained_field = [
            "success",
            "concurrency", 
            "provider", 
            "difficulty", 
            "vocabulary", 
            "length",
            "PCA1"]
        
        input_data = np.array([[data[field].values[0] for field in trained_field]], dtype=float)
        input_data = input_data.reshape((1, 7, 1))

        # Predict
        data["Latency"] = model.predict(input_data)[0][0]
        result = denormalize(data, columns_to_normalize)
        result = decategorize(result)
        result["predicted_latency"] = result["Latency"]
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
                                        "length",
                                        "PCA1"], errors="ignore")
        result["predicted_latency"] = result["predicted_latency"].abs()
        simple_result = {}
        for i in result:
            simple_result[i] = result[i][0]
        return simple_result
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Start the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)
