# PlantCure AI - Machine Learning Plant Disease Detector

PlantCure AI is an advanced, web-based platform designed to help farmers, gardeners, and plant enthusiasts instantly diagnose plant diseases. By analyzing uploaded leaf images, our system detects visual symptoms and predicts the disease with high accuracy, offering seamless integration between a modern frontend and a powerful TensorFlow backend.

## 🚀 Features
- **Instant AI Diagnosis:** Upload a photo of a plant leaf and get instant classifications (e.g., Healthy, Rust, Blight).
- **Interactive UI:** A highly polished, responsive frontend built with modern design principles.
- **Teachable Machine Integration:** Originally built and trained using Google's Teachable Machine, deployed for custom inference.
- **Detailed Treatment Plans:** Provides actionable remedies and treatment suggestions for detected diseases.

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3 (Custom Design System), JavaScript
- **Backend:** Python, Flask
- **AI/Machine Learning:** TensorFlow, Keras (h5 model integration)
- **Deployment:** Vercel (Serverless Functions)

## 📂 Project Structure
```text
AI_Model2_KB/
│
├── Plant-Disease-Detection-main/  # The main frontend web interface
│   ├── index.html                 # Homelanding page
│   ├── detect.html                # Image analysis dashboard
│   ├── css/                       # Global stylesheet and components
│   └── js/                        # Frontend logic (detect.js handles API calls)
│
├── model/                         # Contains model metadata files
├── app.py                         # Flask backend handling /predict endpoint
├── model_keras.h5                 # Trained Keras AI model weights
├── requirements.txt               # Python package dependencies
└── vercel.json                    # Configuration for Vercel deployment
```

## ⚙️ Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mr-unknownnn07/AI_Model.git
   cd AI_Model
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the App:**
   ```bash
   python app.py
   ```
   Open your browser and navigate to `http://127.0.0.1:10000`

## ☁️ Deployment
This project is configured right out of the box for serverless deployment on [Vercel](https://vercel.com). Simply link this repository to your Vercel account, and the `vercel.json` file will automatically direct web traffic to the Python backend.
