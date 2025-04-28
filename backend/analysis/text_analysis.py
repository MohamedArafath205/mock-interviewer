import spacy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re
from typing import Dict, List, Tuple

class TextAnalyzer:
    FILLER_WORDS = {
        "um", "uh", "like", "you know", "so", "actually", "basically", "literally", 
        "I mean", "right", "okay", "well", "hmm"
    }

    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.sentiment_analyzer = SentimentIntensityAnalyzer()

    def analyze_sentiment(self, text: str) -> str:
        sentiment_scores = self.sentiment_analyzer.polarity_scores(text)
        compound_score = sentiment_scores['compound']

        if compound_score > 0.05:
            return "Positive"
        elif compound_score < -0.05:
            return "Negative"
        else:
            return "Neutral"

    def detect_filler_words(self, text: str) -> List[str]:
        text_lower = text.lower()
        fillers_found = []
        for word in self.FILLER_WORDS:
            pattern = r'\b' + re.escape(word) + r'\b'
            matches = re.findall(pattern, text_lower)
            fillers_found.extend(matches)
        return fillers_found

    def detect_pauses(self, text: str) -> List[str]:
        pauses = []
        # Detect ellipsis ...
        ellipsis = len(re.findall(r"\.\.\.", text))
        if ellipsis > 0:
            pauses.extend(["ellipsis"] * ellipsis)

        # Detect long spaces (more than 3 spaces)
        long_spaces = len(re.findall(r" {3,}", text))
        if long_spaces > 0:
            pauses.extend(["long_space"] * long_spaces)

        return pauses

    def analyze_text(self, text: str) -> Dict:
        doc = self.nlp(text)
        sentences = list(doc.sents)

        results = {"Positive": 0, "Negative": 0, "Neutral": 0}
        polarities = []
        total_fillers = 0
        all_fillers = []
        total_pauses = 0
        all_pauses = []
        sentence_analysis = []

        for sentence in sentences:
            sentence_text = str(sentence)
            sentiment = self.analyze_sentiment(sentence_text)
            results[sentiment] += 1
            polarities.append(self.sentiment_analyzer.polarity_scores(sentence_text)['compound'])

            fillers = self.detect_filler_words(sentence_text)
            pauses = self.detect_pauses(sentence_text)

            total_fillers += len(fillers)
            all_fillers.extend(fillers)

            total_pauses += len(pauses)
            all_pauses.extend(pauses)

            sentence_analysis.append({
                'sentence': sentence_text,
                'sentiment': sentiment,
                'polarity_score': self.sentiment_analyzer.polarity_scores(sentence_text)['compound'],
                'filler_words': fillers,
                'pauses': pauses
            })

        total_sentences = sum(results.values())
        sentiment_percentages = {
            sentiment: (count/total_sentences)*100 
            for sentiment, count in results.items()
        }

        avg_polarity = sum(polarities) / len(polarities) if polarities else 0
        overall_sentiment = "Overall Positive" if avg_polarity > 0.05 else "Overall Negative" if avg_polarity < -0.05 else "Overall Neutral"

        filler_summary = {}
        for filler in all_fillers:
            filler_summary[filler] = filler_summary.get(filler, 0) + 1

        pause_summary = {}
        for pause in all_pauses:
            pause_summary[pause] = pause_summary.get(pause, 0) + 1

        return {
            'sentence_analysis': sentence_analysis,
            'overall_analysis': {
                'sentiment_distribution': results,
                'sentiment_percentages': sentiment_percentages,
                'average_polarity': avg_polarity,
                'overall_sentiment': overall_sentiment
            },
            'filler_words': {
                'total': total_fillers,
                'summary': filler_summary
            },
            'pauses': {
                'total': total_pauses,
                'summary': pause_summary
            }
        }

    def close(self):
        pass  # No cleanup needed for spaCy or VADER