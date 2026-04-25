import os
# Try to import tflite_runtime, fallback to tensorflow if needed
try:
    import tflite_runtime.interpreter as tflite
except ImportError:
    try:
        import tensorflow.lite as tflite
    except ImportError:
        tflite = None

print("Tflite loaded:", tflite)
MODEL_PATH = "model.tflite"
try:
    interpreter = tflite.Interpreter(model_path=MODEL_PATH)
    interpreter.allocate_tensors()
    print("Local TFLite Model loaded successfully!")
except Exception as e:
    print(f"Local error loading TFLite model: {e}")
