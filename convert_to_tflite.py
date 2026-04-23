import tf_keras as keras
import tensorflow as tf

# Load the existing model
model = keras.models.load_model('model_keras.h5', compile=False)

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()

# Save the TFLite model
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)

print("✅ Model converted to model.tflite successfully!")
