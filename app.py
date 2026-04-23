from flask import Flask, request, jsonify, send_from_directory
import numpy as np
from PIL import Image
import io
import json
import os
import tf_keras as keras

# Path to the UI folder
UI_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Plant-Disease-Detection-main")

app = Flask(__name__, static_folder=UI_DIR, static_url_path="")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model_keras.h5")
METADATA_PATH = os.path.join(BASE_DIR, "model", "metadata.json")

# 1. Load labels from metadata.json
if os.path.exists(METADATA_PATH):
    with open(METADATA_PATH, "r") as f:
        metadata = json.load(f)
    LABELS = metadata["labels"]
    IMAGE_SIZE = metadata.get("imageSize", 224)
else:
    LABELS = ["HEALTHY", "VIRAL DISEASE", "BACTERIAL DISEASE", "FUNGLE DISEASE"]
    IMAGE_SIZE = 224

# 2. Load the converted Keras model
print("Loading model from model_keras.h5...")
try:
    model = keras.models.load_model(MODEL_PATH, compile=False)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# ── Helpers ──────────────────────────────────────────────────────────────────
def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.resize((IMAGE_SIZE, IMAGE_SIZE))
    arr = np.array(image, dtype=np.float32) / 255.0
    return arr.reshape(1, IMAGE_SIZE, IMAGE_SIZE, 3)

# ── Routes ────────────────────────────────────────────────────────────────────

# Serve the UI (Home Page)
@app.route("/")
def home():
    return send_from_directory(UI_DIR, "index.html")

# Serve other HTML files (detect.html, treatment.html, etc.)
@app.route("/<path:path>")
def serve_static(path):
    if path.endswith(".html"):
        return send_from_directory(UI_DIR, path)
    return send_from_directory(UI_DIR, path)

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
        
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file  = request.files["file"]
    try:
        image = Image.open(io.BytesIO(file.read())).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image file: {e}"}), 400

    processed   = preprocess_image(image)
    predictions = model.predict(processed)[0]

    predicted_index = int(np.argmax(predictions))
    predicted_label = LABELS[predicted_index]
    confidence      = float(predictions[predicted_index])

    all_scores = {LABELS[i]: round(float(predictions[i]) * 100, 2)
                  for i in range(len(LABELS))}

    # Format label for frontend mapping (Healthy, Viral Disease, etc.)
    def format_label(lbl):
        if lbl == "HEALTHY": return "Healthy"
        if lbl == "VIRAL DISEASE": return "Viral Disease"
        if lbl == "BACTERIAL DISEASE": return "Bacterial Disease"
        if lbl == "FUNGLE DISEASE" or lbl == "FUNGAL DISEASE": return "Fungal Disease"
        return lbl

    return jsonify({
        "prediction": format_label(predicted_label),
        "confidence": round(confidence * 100, 2),
        "all_scores": {format_label(k): v for k, v in all_scores.items()}
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
