# pyenv env := cap_faceRC

import cv2
import os
import numpy as np
import insightface
from insightface.app import FaceAnalysis
from scipy.spatial.distance import euclidean

from numpy.linalg import norm

# Initialize the FaceAnalysis app
app = FaceAnalysis(providers=['CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))

# Function to extract embeddings for a given face image
def get_embedding(img_paths):
    embeddings = []
    for img_path in img_paths:
        img = cv2.imread(img_path)
        faces = app.get(img)
        if faces and len(faces) > 0:
            embeddings.append(faces[0].embedding)
    return np.mean(embeddings, axis=0) if embeddings else None

known_embeddings = {}

img_dir = "Intellidesk"

def get_image_paths(directory):
    image_paths = []
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')): 
            image_paths.append(os.path.join(directory, filename))
    return image_paths

persons = {}
for person_name in os.listdir(img_dir):
    person_dir = os.path.join(img_dir, person_name)
    if os.path.isdir(person_dir):
        persons[person_name] = get_image_paths(person_dir)


print(persons)

# Extract and store embeddings for each known person
for name, img_path in persons.items():
    embedding = get_embedding(img_path)
    if embedding is not None:
        known_embeddings[name] = embedding


def euclidean_distance(embedding1, embedding2):
    return euclidean(embedding1, embedding2)


def cosine_similarity(embedding1, embedding2):
    return np.dot(embedding1, embedding2) / (norm(embedding1) * norm(embedding2))

# Target img
# img_path = 'Intellidesk/Matthew/Matthew_2.jpg'
img_path = '/Users/jefflai/intellidesk-screen/Matthew_4.jpg'
img = cv2.imread(img_path)

# Detect faces and extract features in your image
faces = app.get(img)

similarity_threshold = 0.1  # Adjust this threshold as needed

# Identify persons in the image
for face in faces:
    embedding = face.embedding
    max_similarity = -1
    identity = 'Unknown'
    for name, known_embedding in known_embeddings.items():
        similarity = cosine_similarity(embedding, known_embedding)
        if similarity > max_similarity:
            max_similarity = similarity
            identity = name if similarity > similarity_threshold else 'Unknown'

    # Draw bounding box and label
    bbox = face.bbox.astype(np.int32)
    cv2.rectangle(img, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
    cv2.putText(img, identity, (bbox[0], bbox[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)


# Save or display the result
cv2.imwrite("./output.jpg", img)  # Save the image

