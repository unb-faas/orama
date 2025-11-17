from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
import pandas as pd
from flask_cors import CORS

best_results_path = "/model/best_results/20251117_232305-opt_False-opt_ep_5-train_ep_100/"
model_name = "model_BLSTM.keras"

# Run the app Flask
app = Flask(__name__)
CORS(app)

# Load the model
model = tf.keras.models.load_model(f"{best_results_path}{model_name}")

# Load encoders
encoders = joblib.load(f"{best_results_path}/encoders.pkl")

# Load scaler
scaler = joblib.load(f"{best_results_path}/scaler.pkl")
print("Scaler order: ", scaler.feature_names_in_)

# Load feature order
feature_order = joblib.load(f"{best_results_path}/feature_order.pkl")
print("Feature Order:", feature_order)

# Local PCA
#pca = joblib.load(f"{best_results_path}/pca.pkl")

# Local PCA scaler
#pca_scaler = joblib.load(f"{best_results_path}/pca_scaler.pkl")

def categorize(data):
    for column in ['provider', 'input_level']:
        data[column] = encoders[column].transform(data[column])
    return data

def decategorize(data):
    for column, label_encoder in encoders.items():
        data[column] = label_encoder.inverse_transform(data[column].astype(int))    
    return data

def normalize(data):
    normalized_data = data.copy()
    normalized_data = normalized_data[scaler.feature_names_in_]
    columns_to_normalize = [col for col in normalized_data.columns]
    app.logger.info(columns_to_normalize)
    normalized_data[columns_to_normalize] = scaler.transform(normalized_data[columns_to_normalize])
    return normalized_data

def denormalize(normalized_data):
    normalized_data = normalized_data.copy()
    normalized_data = normalized_data[scaler.feature_names_in_]
    columns_to_normalize = [col for col in normalized_data.columns]
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

# def reduce_scale_pca(data):
#     # Normalize
#     X_scaled = pca_scaler.transform(data[cols_pca])

#     # Reduce to 1 component
#     principal_components = pca.transform(X_scaled)

#     # Add to dataset
#     df_pca = pd.DataFrame(principal_components, columns=["PCA1"])
#     #df_pca = pd.DataFrame(principal_components, columns=["PCA1"])
#     data["duration"] = 0
#     df = data.merge(df_pca, left_index=True, right_index=True)

#     return df

def remove_reduced_collumns(data):
    return data.drop(columns=cols_pca, axis=1)

# Route to prediction
@app.route('/predict_duration', methods=['POST'])
def predict_latency():
    try:
        data = request.json
        expected_fields = [
         'concurrency', 
         'provider',
         'input_level', 
         'total_operands', 
         'distinct_operands', 
         'total_operators', 
         'distinct_operators', 
         'time', 
         'bugs', 
         'effort', 
         'volume', 
         'difficulty', 
         'vocabulary', 
         'length', 
         'success']

        if not all(field in data for field in expected_fields):
            return jsonify({"error": "Missing fields in input data"}), 400
        df = pd.DataFrame([data])       
        data = categorize(df)
        data['duration'] = 0
        
        # Reduce scale - REMOVED
        #data = reduce_scale_pca(data)
        #data = remove_reduced_collumns(data)
        #columns_to_normalize = [col for col in data.columns]
        data = normalize(data)
        #data = pd.DataFrame(data)
        data = data.drop(columns=['duration'])
        app.logger.info("CP03")
                
        trained_field = [
         'concurrency', 
         'success',
         'provider',
         'input_level',
         'total_operands', 
         'distinct_operands', 
         'total_operators', 
         'distinct_operators', 
         'time', 
         'bugs', 
         'effort', 
         'volume', 
         'difficulty', 
         'vocabulary', 
         'length']
        
        # Predict
        prediction = model.predict(data)
        data["duration"] = prediction[0][0]
        result = denormalize(data)
        result = decategorize(result)
        result["predicted_duration"] = result["duration"]
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
                                        "duration",
                                        "input_level",
                                        "PCA1"], errors="ignore")
        result["predicted_duration"] = result["predicted_duration"].abs()
        simple_result = {}
        for i in result:
            simple_result[i] = result[i][0]
        return simple_result
    except Exception as e:
        app.logger.error(e)
        return jsonify({"error": str(e)}), 500

# Start the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
