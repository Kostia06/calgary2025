import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt
import os

# Define paths
training_images_path = "./training_images"
num_classes = 90
BATCH_SIZE = 32
IMAGE_SIZE = (128, 128)
VALIDATION_SPLIT = 0.1  # 10% validation split

# Function to load data using tf.data API
def load_data():
    train_dataset = tf.keras.utils.image_dataset_from_directory(
        training_images_path,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        validation_split=VALIDATION_SPLIT,
        subset="training",
        seed=42  # Ensures consistent split
    )

    val_dataset = tf.keras.utils.image_dataset_from_directory(
        training_images_path,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        validation_split=VALIDATION_SPLIT,
        subset="validation",
        seed=42
    )

    return train_dataset, val_dataset

# Normalize images
def normalize(image, label):
    image = tf.cast(image, tf.float32) / 255.0  # Scale pixels to [0,1]
    label = tf.one_hot(label, depth=num_classes)  # Convert to one-hot encoding
    return image, label

# Data augmentation function
def augment(image, label):
    image = tf.image.random_flip_left_right(image)
    image = tf.image.random_brightness(image, max_delta=0.2)
    image = tf.image.random_contrast(image, 0.8, 1.2)
    return image, label

# Create the CNN model
def create_model():
    model = tf.keras.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),  # Dropout to reduce overfitting

        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),  # Larger dropout before final layer
        layers.Dense(num_classes, activation='softmax')
    ])
    return model

def main():
    # Load datasets
    train_data, val_data = load_data()

    # Apply augmentation only on training data
    train_data = train_data.map(augment)

    # Normalize both datasets
    train_data = train_data.map(normalize)
    val_data = val_data.map(normalize)

    # Optimize the input pipeline
    train_data = train_data.shuffle(1000).cache().prefetch(tf.data.AUTOTUNE)
    val_data = val_data.cache().prefetch(tf.data.AUTOTUNE)

    # Create model
    model = create_model()

    # Compile model
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Train the model
    history = model.fit(
        train_data,
        validation_data=val_data,
        epochs=10
    )

    # Evaluate model on validation data
    val_loss, val_acc = model.evaluate(val_data)
    print(f"Validation Accuracy: {val_acc:.2f}")

    # Save the model
    os.makedirs("./models", exist_ok=True)
    model.save('./models/cnn_model.h5')

    # Plot training history
    plt.plot(history.history['accuracy'], label='Train Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend(loc='lower right')
    plt.show()

# Run the main function
if __name__ == "__main__":
    main()
