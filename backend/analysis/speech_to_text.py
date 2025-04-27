import speech_recognition as sr
from typing import Optional
import tempfile
import os

class SpeechRecognizer:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def recognize_from_file(self, audio_file_path: str) -> Optional[str]:
        try:
            with sr.AudioFile(audio_file_path) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio)
                return text
        except sr.UnknownValueError:
            return None
        except sr.RequestError as e:
            raise Exception(f"Could not request results; {e}")

    def recognize_from_bytes(self, audio_bytes: bytes) -> Optional[str]:
        try:
            # Create a temporary file to store the audio bytes
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name

            # Recognize the audio
            text = self.recognize_from_file(temp_file_path)

            # Clean up the temporary file
            os.unlink(temp_file_path)

            return text
        except Exception as e:
            raise Exception(f"Error processing audio: {e}")