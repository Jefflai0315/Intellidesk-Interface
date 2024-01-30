import speech_recognition as sr

def listen_for_jarvis():
    # Initialize the recognizer
    recognizer = sr.Recognizer()

    # Start the microphone and begin listening
    with sr.Microphone() as source:
        print("Listening for 'Jarvis'...")
        recognizer.adjust_for_ambient_noise(source)  # Adjust for ambient noise
        audio = recognizer.listen(source)

        try:
            # Recognize speech using Google's speech recognition
            text = recognizer.recognize_google(audio).lower()
            print(f"Recognized: {text}")

            if "jarvis" in text:
                print("Jarvis detected!")
                # Perform your action here
                # e.g., call another function or run a command

        except sr.UnknownValueError:
            print("Could not understand audio")
        except sr.RequestError:
            print("Could not request results from Google Speech Recognition service")

if __name__ == "__main__":
    while True:
        listen_for_jarvis()
