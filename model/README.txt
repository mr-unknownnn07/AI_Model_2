# ════════════════════════════════════════════
#   PlantCure AI — Model Folder
#   AI-Based Plant Disease Detection System
# ════════════════════════════════════════════

## What goes in this folder?

To use your own trained AI model with PlantCure AI, 
place these 3 files (exported from Teachable Machine) in this folder:

  1. model.json       ← The main model architecture file
  2. weights.bin      ← The model weights (binary data)
  3. metadata.json    ← Class names and model metadata

## How to Train Your Model (Teachable Machine)

1. Go to: https://teachablemachine.withgoogle.com/
2. Click "Get Started" → "Image Project" → "Standard image model"
3. Create classes:
   - Class 1: "Healthy" — upload 50+ photos of healthy plant leaves
   - Class 2: "Diseased" — upload 50+ photos of diseased plant leaves
   - (Add more classes for specific diseases if needed)
4. Click "Train Model"
5. After training: "Export Model" → "TensorFlow.js" → "Download"
6. Extract the zip file — you'll get model.json, weights.bin, metadata.json
7. Copy those 3 files into THIS folder (model/)

## File Structure Expected:
  AI_Model2/
  ├── model/
  │   ├── model.json       ← REQUIRED
  │   ├── weights.bin      ← REQUIRED  
  │   └── metadata.json    ← REQUIRED

## Without a model:
The website runs in "Demo Mode" — it simulates AI predictions
so you can see all features working while you train your model.

## Notes:
- Model runs 100% in the browser using TensorFlow.js
- No data is sent to any server — completely private
- Detection accuracy depends on training data quality
- Aim for at least 100 images per class for best results

## Recommended Plant Classes to Train:
  ✅ Healthy
  ⚠️ Powdery Mildew
  🍂 Leaf Blight
  ⚫ Black Spot
  🦠 Rust Disease
  🌱 Root Rot
  🔴 Bacterial Leaf Spot

Good luck with your AI project! 🌿
