import time
import picamera

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
    file_path = "/home/pi/image.jpg"  # Path to save the captured image
    capture_image(file_path)
