import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import tensorflow as tf
import numpy as np
import cv2
import sys

# Constants
MODEL_PATH = "./cnn_model(4).h5"
IMAGE_SIZE = (128, 128)  # Match your training size

# Load the trained model
model = tf.keras.models.load_model(MODEL_PATH)

# Get class names (from training dataset)
CLASS_NAMES = ['badger', 'bald_eagle', 'bat', 'bear', 'bee', 'beetle',
                'bighorn_sheep', 'bison', 'black_bear', 'boar', 'brown_bear',
                'burrowing_owl', 'butterfly', 'canada_goose_bird', 'caribou', 
                'cat', 'caterpillar', 'chimpanzee', 'cockroach', 'cougar', 'cow', 
                'coyote', 'crab', 'crow', 'deer', 'dog', 'dolphin', 'donkey', 
                'dragonfly', 'duck', 'eagle', 'elephant', 'elk', 'flamingo', 'fly', 
                'fox', 'goat', 'golden_eagle', 'goldfish', 'goose', 'gorilla', 'grasshopper', 
                'great_horned_owl', 'hamster', 'hare', 'hedgehog', 'hippopotamus', 'hornbill', 'horse', 
                'hummingbird', 'hyena', 'jellyfish', 'kangaroo', 'koala', 'ladybugs', 'leopard', 
                'lion', 'lizard', 'lobster', 'lynx', 'moose', 'mosquito', 'moth', 'mountain_goat', 
                'mouse', 'mule_deer', 'octopus', 'okapi', 'orangutan', 'otter', 'owl', 'ox', 'oyster', 
                'panda', 'parrot', 'pelecaniformes', 'penguin', 'pig', 'pigeon', 'pine_marten', 'porcupine', 
                'possum', 'raccoon', 'rat', 'reindeer', 'rhinoceros', 'river_otter', 'sandpiper', 'seahorse', 'seal', 
                'shark', 'sheep', 'snake', 'snow_goose', 'sparrow', 'squid', 'squirrel', 'starfish', 'swan', 
                'tiger', 'turkey', 'turtle', 'whale', 'white_tail_deer', 'wolf', 'wombat', 'woodpecker', 'zebra']

def preprocess_image(image_path):
    """Loads and preprocesses an image for the model."""
    if not os.path.exists(image_path):  # Check if the file exists
        print(f"Error: File '{image_path}' not found.")
        return None

    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Unable to load '{image_path}'. Check the format and path.")
        return None

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB
    image = cv2.resize(image, IMAGE_SIZE)  # Resize to model's input size
    image = image.astype("float32") / 255.0  # Normalize to [0,1]
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image


def predict(image_path, top_k=5):
    """Runs inference and prints the top K predicted classes with confidence scores."""
    image = preprocess_image(image_path)

    if image is None:
        print("Skipping prediction due to image loading error.")
        return

    predictions = model.predict(image)[0]  # Get predictions for the single image

    # Get the indices sorted by confidence (highest first)
    sorted_indices = np.argsort(predictions)[::-1]

    for i in range(min(top_k, len(CLASS_NAMES))):
        class_index = sorted_indices[i]
        confidence = predictions[class_index] * 100
        predicted_class = CLASS_NAMES[class_index]
        print(f"{predicted_class}, {confidence:.2f}%")


# Example Usage
if __name__ == "__main__":
    if len(sys.argv) > 1:
        predict(sys.argv[1])
