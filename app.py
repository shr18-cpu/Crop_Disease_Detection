from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Load your pre-trained model (make sure model file is in the same folder)
MODEL_PATH = "trained_Crop_disease_model.keras"
model = load_model(MODEL_PATH)

# Define class labels
class_labels = [
    "Healthy Maize",
    "Healthy Wheat",
    "maize ear rot",
    "maize fall armyworm",
    "maize stem borer",
    "RedRot sugarcane",
    "RedRust sugarcane",
    "Sugarcane Healthy",
    "Wheat black rust",
    "Wheat Brown leaf Rust",
    "Wheat mite",
    "Yellow Rust Sugarcane"
]

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))  # adjust size to model input
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    filepath = os.path.join("uploads", file.filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(filepath)

    # Preprocess and predict
    img_array = preprocess_image(filepath)
    prediction = model.predict(img_array)
    predicted_class = class_labels[int(np.argmax(prediction))]
    confidence = float(np.max(prediction))

    return jsonify({
        "prediction": predicted_class,
        "confidence": round(confidence * 100, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
