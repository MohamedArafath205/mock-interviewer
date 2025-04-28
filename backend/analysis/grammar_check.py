from language_tool_python import LanguageTool
import re
from typing import List, Dict

class GrammarChecker:
    def __init__(self):
        self.tool = LanguageTool('en-US')

    def check_text(self, text: str) -> Dict:
        try:
            # Get grammar and spelling errors
            matches = self.tool.check(text)
            error_details = []
            total_errors = 0

            for match in matches:
                error_details.append({
                    'sentence': text[match.offset:match.offset + match.errorLength],
                    'error': match.message,
                    'suggestions': match.replacements
                })
                total_errors += 1

            # Check for common filler words
            filler_words = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'literally']
            for word in filler_words:
                if word in text.lower():
                    error_details.append({
                        'sentence': text,
                        'error': f"Filler word detected: {word}",
                        'suggestions': ["Consider removing filler words for more professional communication"]
                    })
                    total_errors += 1

            return {
                'total_errors': total_errors,
                'errors': error_details
            }
        except Exception as e:
            print(f"Error checking grammar: {e}")
            return {
                'total_errors': 0,
                'errors': [],
                'error': str(e)
            }

    def close(self):
        self.tool.close() 