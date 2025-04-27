import spacy
import speech_recognition as sr
from language_tool_python import LanguageTool
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
import sys

class InterviewAnalyzer:
    def __init__(self):
        # Initialize spaCy with English language model
        self.nlp = spacy.load("en_core_web_sm")
        
        # Initialize complementary tools
        self.grammar_tool = LanguageTool('en-US')
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.recognizer = sr.Recognizer()
        
        # Common filler words to detect
        self.filler_words = set([
            "um", "uh", "ah", "like", "you know", "sort of", "kind of",
            "basically", "literally", "actually", "so", "well"
        ])

    def analyze_speech(self, audio_file_path):
        """Convert speech to text and analyze it"""
        try:
            with sr.AudioFile(audio_file_path) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio)
                return self.analyze_text(text)
        except Exception as e:
            return f"Error processing audio: {str(e)}"

    def analyze_text(self, text):
        """Analyze text for various aspects"""
        # Process text with spaCy
        doc = self.nlp(text)
        
        # Analyze different aspects
        analysis = {
            'grammar_check': self._check_grammar(text),
            'sentiment': self._analyze_sentiment(text),
            'filler_words': self._detect_filler_words(doc),
            'linguistic_analysis': self._analyze_linguistics(doc)
        }
        
        return analysis

    def _check_grammar(self, text):
        """Check grammar using LanguageTool"""
        matches = self.grammar_tool.check(text)
        return [{
            'error': match.ruleId,
            'message': match.message,
            'suggestions': match.replacements,
            'context': match.context
        } for match in matches]

    def _analyze_sentiment(self, text):
        """Analyze sentiment using VADER"""
        sentiment_scores = self.sentiment_analyzer.polarity_scores(text)
        
        # Interpret sentiment scores
        if sentiment_scores['compound'] >= 0.05:
            overall = 'Positive'
        elif sentiment_scores['compound'] <= -0.05:
            overall = 'Negative'
        else:
            overall = 'Neutral'
            
        return {
            'scores': sentiment_scores,
            'overall': overall
        }

    def _detect_filler_words(self, doc):
        """Detect filler words using spaCy"""
        found_fillers = []
        for token in doc:
            if token.text.lower() in self.filler_words:
                found_fillers.append({
                    'word': token.text,
                    'position': token.i
                })
        return found_fillers

    def _analyze_linguistics(self, doc):
        """Analyze linguistic patterns using spaCy"""
        return {
            'sentence_count': len(list(doc.sents)),
            'word_count': len(doc),
            'entities': [(ent.text, ent.label_) for ent in doc.ents],
            'pos_tags': [(token.text, token.pos_) for token in doc]
        }

    def cleanup(self):
        """Cleanup resources"""
        self.grammar_tool.close()

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No text provided"}))
        sys.exit(1)

    text = sys.argv[1]
    analyzer = InterviewAnalyzer()
    
    try:
        results = analyzer.analyze_text(text)
        print(json.dumps(results))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
    finally:
        analyzer.cleanup()

if __name__ == "__main__":
    main() 