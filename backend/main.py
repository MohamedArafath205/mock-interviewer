from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import OpenAI
import os
from typing import Optional
import tempfile
import shutil
from pydantic import BaseModel
from dotenv import load_dotenv

# Import analysis modules
from analysis.grammar_check import GrammarChecker
from analysis.speech_to_text import SpeechRecognizer
from analysis.text_analysis import TextAnalyzer

# Load environment variables
load_dotenv()

app = FastAPI(title="Mock Interviewer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize analysis tools
grammar_checker = GrammarChecker()
speech_recognizer = SpeechRecognizer()
text_analyzer = TextAnalyzer()

class QuestionRequest(BaseModel):
    topic: str

class TextRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Welcome to Mock Interviewer API"}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        # Transcribe the audio
        with open(temp_file_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )

        # Content moderation
        moderation = client.moderations.create(
            input=transcript.text
        )

        if moderation.results[0].flagged:
            raise HTTPException(
                status_code=400,
                detail="Inappropriate content detected. Please try again."
            )

        # Clean up the temporary file
        os.unlink(temp_file_path)

        return {"transcript": transcript.text}

    except Exception as e:
        error_message = str(e)
        if "insufficient_quota" in error_message:
            raise HTTPException(
                status_code=429,
                detail="OpenAI API quota exceeded. Please check your billing details or try again later."
            )
        elif "invalid_api_key" in error_message:
            raise HTTPException(
                status_code=401,
                detail="Invalid OpenAI API key. Please check your API key configuration."
            )
        else:
            raise HTTPException(status_code=500, detail=f"Error: {error_message}")

@app.post("/generate-feedback")
async def generate_feedback(prompt: str):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a tech hiring manager. You are to only provide feedback on the interview candidate's transcript. If it is not relevant and does not answer the question, make sure to say that. Do not be overly verbose and focus on the candidate's response."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=450
        )
        return {"feedback": response.choices[0].message.content}
    except Exception as e:
        error_message = str(e)
        if "insufficient_quota" in error_message:
            raise HTTPException(
                status_code=429,
                detail="OpenAI API quota exceeded. Please check your billing details or try again later."
            )
        elif "invalid_api_key" in error_message:
            raise HTTPException(
                status_code=401,
                detail="Invalid OpenAI API key. Please check your API key configuration."
            )
        else:
            raise HTTPException(status_code=500, detail=f"Error: {error_message}")

@app.get("/get-questions")
async def get_questions(topic: str):
    try:
        # This is a placeholder. You should implement your own question generation logic
        questions = {
            "Behavioral": [
                "Tell me about yourself. Why don't you walk me through your resume?",
                "What is your greatest strength?",
                "What is your greatest weakness?"
            ],
            "Technical": [
                "What is a Hash Table, and what is the average case and worst case time for each of its operations?",
                "Explain the concept of Big O notation.",
                "What is the difference between REST and GraphQL?"
            ]
        }
        return {"Questions": questions.get(topic, [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New analysis endpoints
@app.post("/analyze-grammar")
async def analyze_grammar(request: TextRequest):
    try:
        result = grammar_checker.check_text(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-speech")
async def analyze_speech(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = speech_recognizer.recognize_from_bytes(contents)
        if text is None:
            raise HTTPException(status_code=400, detail="Could not recognize speech")
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-text")
async def analyze_text(request: TextRequest):
    try:
        result = text_analyzer.analyze_text(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 