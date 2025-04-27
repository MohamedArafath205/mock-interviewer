# Mock Interviewer Backend

This is the FastAPI backend for the Mock Interviewer application. It provides endpoints for video transcription, feedback generation, and question management.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Running the Server

To run the development server:
```bash
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

## API Endpoints

### GET /
- Welcome message

### POST /transcribe
- Transcribes audio from an uploaded file
- Returns the transcript text

### POST /generate-feedback
- Generates feedback based on the interview transcript
- Returns feedback text

### GET /get-questions
- Returns a list of questions based on the topic
- Query parameter: `topic` (e.g., "Behavioral" or "Technical")

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 