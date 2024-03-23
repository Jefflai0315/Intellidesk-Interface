import time
import picamera
import firebase_admin
from firebase_admin import credentials
from firebase_admin import initialize_app, storage
from firebase_admin import db

# def initialize_firebase():

#         # Initialize Firebase Admin SDK
#     service_account_path = "intellidesk-174c9-firebase-adminsdk-garkf-abe9a9fb75.json"  # Path to your service account JSON file
#     firebase_config = {
#         'storageBucket': 'intellidesk-174c9.appspot.com'
#     }
#     initialize_app(credential=service_account_path, options=firebase_config)
#     return db.reference()
def capture_images(output_dir, num_images, interval):
        # Create the output directory if it doesn't exist


        # Capture images
        for i in range(num_images):
            # Wait for the specified interval
            time.sleep(interval)
            file_name = output_dir+ '/images'+str(i)+'.jpg'
            capture_image(file_name)
            bucket = storage.bucket()
            blob = bucket.blob(file_name)
            blob.upload_from_filename(file_name)


def capture_image(file_path):
    with picamera.PiCamera() as camera:
        # Adjust camera settings as needed
        camera.resolution = (1080, 1920)  # Set resolution
        camera.rotation = 180  # Set rotation (0, 90, 180, 270)
        # camera.start_preview()
        # Camera warm-up time
        # Capture image
        camera.capture(file_path)
        print(f"Image captured and saved to: {file_path}")

if __name__ == "__main__":
        # Initialize Firebase Admin SDK
    cred = credentials.Certificate("intellidesk-174c9-firebase-adminsdk-garkf-abe9a9fb75.json")
    service_account_path = "intellidesk-174c9-firebase-adminsdk-garkf-abe9a9fb75.json"  # Path to your service account JSON file
    firebase_config = {
        'storageBucket': 'intellidesk-174c9.appspot.com',
        'databaseURL' : "https://intellidesk-174c9-default-rtdb.asia-southeast1.firebasedatabase.app/"
    }
    initialize_app(cred,firebase_config)
    ref = db.reference()  # Path to the desired data in the Realtime Database
    file_name = "/home/pi/image.jpg"
    local_file_path = "/home/pi/image.jpg"  # Local path to save the captured image
    # Capture image here using picamera or another library
    # Save the captured image to local_file_path
    while True: 
        PostureCamera = ref.child('Controls/PostureCamera').get()
        BiometricRecroding = ref.child('Controls/BiometricRecording').get()
        print(PostureCamera,BiometricRecroding)
        if  BiometricRecroding == 1:
            print("biometric recording")
            num_images = 5
            interval = 1  # seconds
            img_dir = "SetUpImages"
            capture_images(img_dir, num_images, interval)
            ref.child('Controls/').update({'BiometricRecording':3})

        elif PostureCamera == 1 or PostureCamera == 2:
            print("posture camera")
            time.sleep(1)
            capture_image(local_file_path)

            # Upload image to Firebase Storage
            bucket = storage.bucket()
            blob = bucket.blob(file_name)
            blob.upload_from_filename(local_file_path)
    
