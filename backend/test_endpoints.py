import requests
import json

BASE_URL = "http://localhost:8000"

def test_grammar_analysis():
    print("\nTesting Grammar Analysis...")
    response = requests.post(
        f"{BASE_URL}/analyze-grammar",
        json={"text": "I am a software engineer with 5 years of experience. I have worked on many projects and have good communication skills."}
    )
    print(f"Status Code: {response.status_code}")
    print("Response:", json.dumps(response.json(), indent=2))

def test_text_analysis():
    print("\nTesting Text Analysis...")
    response = requests.post(
        f"{BASE_URL}/analyze-text",
        json={"text": "I am a software engineer with 5 years of experience. I have worked on many projects and have good communication skills."}
    )
    print(f"Status Code: {response.status_code}")
    print("Response:", json.dumps(response.json(), indent=2))

def test_speech_analysis():
    print("\nTesting Speech Analysis...")
    # Note: This is a placeholder. You'll need to provide an actual audio file
    print("Please provide an audio file to test speech analysis")
    print("You can test this endpoint through the Swagger UI at http://localhost:8000/docs")

if __name__ == "__main__":
    print("Testing all endpoints...")
    test_grammar_analysis()
    test_text_analysis()
    test_speech_analysis() 