# Mock Interviewer

A web application that helps users practice interviews by providing real-time speech analysis, grammar checking, and feedback on their interview responses.

## Features

- Real-time video recording
- Speech-to-text conversion
- Comprehensive analysis including:
  - Grammar checking
  - Sentiment analysis
  - Filler word detection
  - Linguistic analysis
- Detailed feedback on interview performance
- Modern, responsive UI

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 14.0 or higher
- npm or yarn
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Krishna311204/mock-interviewer.git
cd mock-interviewer
```

### 2. Set Up Python Environment

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Download spaCy English model
python -m spacy download en_core_web_sm
```

### 3. Set Up Node.js Environment

```bash
# Install Node.js dependencies
npm install
```

## Running the Application

1. Start the Next.js development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. Navigate to the video interview page
2. Allow camera and microphone permissions when prompted
3. Start recording your interview response
4. Speak clearly and naturally
5. Stop recording when finished
6. View your detailed analysis results

## Project Structure

```
mock-interviewer/
├── backend/
│   └── analysis/
│       ├── grammar_check.py
│       └── text_analysis.py
├── pages/
│   ├── api/
│   │   └── analyze.js
│   ├── video_interview.jsx
│   └── analysis_results.jsx
├── components/
├── public/
├── styles/
├── interview_analyzer.py
├── requirements.txt
└── package.json
```

## Technologies Used

- **Frontend:**
  - Next.js
  - React
  - Tailwind CSS
  - Framer Motion

- **Backend:**
  - Python
  - spaCy
  - LanguageTool
  - VADER Sentiment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- spaCy for natural language processing
- LanguageTool for grammar checking
- VADER for sentiment analysis
- Next.js team for the amazing framework
