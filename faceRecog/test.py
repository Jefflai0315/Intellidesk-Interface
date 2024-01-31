import cv2
import numpy as np
import insightface
from insightface.app import FaceAnalysis

# Load your own image
img = cv2.imread('path_to_your_image.jpg')

# Initialize the FaceAnalysis app
app = FaceAnalysis(providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])
app.prepare(ctx_id=0, det_size=(640, 640))

# Detect faces and extract features
faces = app.get(img)

# For each detected face, compare with known embeddings to identify persons
for face in faces:
    # Assume `known_embeddings` is a dictionary with person names as keys and their embeddings as values
    # Also assume `calculate_distance` is a function that calculates the distance between two embeddings
    best_match = None
    min_distance = float('inf')
    for name, known_embedding in known_embeddings.items():
        distance = calculate_distance(face.embedding, known_embedding)
        if distance < min_distance:
            min_distance = distance
            best_match = name

    # Set the name of the person for the face object if match is found within a threshold
    if best_match and min_distance < threshold:
        face.name = best_match
    else:
        face.name = 'Unknown'

# Draw bounding boxes and names
for face in faces:
    bbox = face.bbox.astype(np.int32)
    cv2.rectangle(img, (bbox[0], bbox[1]), (bbox[2], bbox[3]), (0, 255, 0), 2)
    cv2.putText(img, face.name, (bbox[0], bbox[1] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

# Save the annotated image
cv2.imwrite("./t1_output.jpg", img)
