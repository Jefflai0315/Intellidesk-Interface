import time
import picamera
import firebase_admin

from firebase_admin import initialize_app, storage
from firebase_admin import db




def capture_image(file_path):
    with picamera.PiCamera() as camera:
        # Adjust camera settings as needed
        camera.resolution = (1080, 1920)  # Set resolution
        camera.rotation = 180  # Set rotation (0, 90, 180, 270)
        camera.start_preview()
        # Camera warm-up time
        time.sleep(2)
        # Capture image
        camera.capture(file_path)
        print(f"Image captured and saved to: {file_path}")

if __name__ == "__main__":
        # Initialize Firebase Admin SDK
    service_account_path = "intellidesk-174c9-firebase-adminsdk-garkf-abe9a9fb75.json"  # Path to your service account JSON file
    firebase_config = {
        'storageBucket': 'intellidesk-174c9.appspot.com'
    }
    file_name = "/home/pi/image.jpg"
    local_file_path = "/home/pi/image.jpg"  # Local path to save the captured image
    # Capture image here using picamera or another library
    # Save the captured image to local_file_path
    capture_image(local_file_path)

    # Upload image to Firebase Storage
    bucket = storage.bucket()
    blob = bucket.blob(file_name)
    blob.upload_from_filename(local_file_path)
   
