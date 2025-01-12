import numpy as np
import PIL
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential
import os


model_path = os.path.join(os.path.dirname(__file__), "model.keras")

# Load the Keras model
model = tf.keras.models.load_model(model_path)

