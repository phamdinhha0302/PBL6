from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import os
import io

app = Flask(__name__)
CORS(app)

# Get the model path dynamically
model_path = os.path.join(os.path.dirname(__file__), "model.keras")

# Load the Keras model
model = tf.keras.models.load_model(model_path)

class_indices = {'shirt': 0, 'clock': 1}
image_size = (180, 180)

# Function to preprocess image and predict
def preprocess_and_predict(image_file, model, image_size, class_indices):
    img = image.load_img(io.BytesIO(image_file.read()), target_size=image_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize image

    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction, axis=1)[0]
    class_names = {v: k for k, v in class_indices.items()}
    return class_names[predicted_class], prediction[0]

# Endpoint to handle image upload and prediction
@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image_file = request.files['image']

    try:
        # Replace with your actual class indices
        
        predicted_category, probabilities = preprocess_and_predict(image_file, model, image_size, class_indices)

        return jsonify({
            "message": "Inference completed",
            "predicted_category": predicted_category,
            "probabilities": probabilities.tolist()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=4444)
