# Crop_Disease_Detection
Our prototype is an AI-powered crop monitoring and advisory system designed for farmers. Using a simple website, farmers can upload a photo of their crop leaf. Our system will detect whether the plant is healthy or affected by common diseases. Based on the result, it provides localized, low-cost advisory recommendations (e.g., remedies, prevention tips) and integrates weather data to guide timely actions.
The prototype demonstrates how affordable AI technology can deliver early detection, actionable insights, and multilingual support, helping farmers reduce crop losses and improve yield without relying on expensive tools like drones or IoT devices.
Technologies & Tools Used
1. Google Colab
The notebook is running in Google Colab, which provides:
Free GPU/TPU runtime.
Integration with Google Drive for dataset storage.
Easy file download/upload utilities (from google.colab import files).

2. Programming Language
Python is the main language.
Colab supports Python 3.x by default.

3. Core Libraries
TensorFlow / Keras
tensorflow and keras are used for deep learning.
VGG16 (pre-trained CNN model on ImageNet) is imported from tensorflow.keras.applications.
Sequential, Flatten, Dense, Dropout, Input are used to build custom layers.
Adam optimizer is used for training.
image_dataset_from_directory helps load images from folders directly into TensorFlow datasets.
Transfer Learning and Fine-Tuning are applied using VGG16.
Matplotlib
For plotting graphs (training vs validation accuracy).

4. Deep Learning Techniques
Transfer Learning: Uses pre-trained VGG16 (without top layers).
Data Augmentation:
RandomFlip, RandomRotation, RandomZoom to improve generalization.
Fine-Tuning:
Initially freezes VGG16 base.
Later unfreezes and retrains with a smaller learning rate (1e-5).
Classification Task:
Multi-class classification with softmax activation.
categorical_crossentropy loss function.

5. Data Handling
Datasets loaded from Google Drive (/content/drive/MyDrive/Dataset_Crops).
Splitting into training, validation, and test sets.
Preprocessing with preprocess_input (VGG16-specific normalization).
Performance optimization using:
.cache()
.prefetch(buffer_size=AUTOTUNE)

6. Model Saving & Export
Model is saved in Keras format:
model.save('trained_Crop_disease_model.keras')


from google.colab import files
files.download("trained_Crop_disease_model.keras")
