from pyspellchecker import SpellChecker
from textblob import TextBlob
import re
from typing import List, Dict, Optional
import os
import tempfile
import shutil
import requests
import zipfile
import io

class GrammarChecker:
    def __init__(self):
        self.spell = SpellChecker()

    def check_text(self, text: str) -> Dict:
        try:
            # Split text into sentences
            sentences = TextBlob(text).sentences
            error_details = []
            total_errors = 0

            for sentence in sentences:
                # Check spelling
                words = sentence.words
                misspelled = self.spell.unknown(words)
                
                if misspelled:
                    for word in misspelled:
                        suggestions = list(self.spell.candidates(word))
                        error_details.append({
                            'sentence': str(sentence),
                            'error': f"Misspelled word: {word}",
                            'suggestions': suggestions[:3] if suggestions else []
                        })
                        total_errors += 1

                # Basic grammar check using TextBlob
                corrected = str(sentence.correct())
                if corrected != str(sentence):
                    error_details.append({
                        'sentence': str(sentence),
                        'error': "Possible grammar error",
                        'suggestions': [corrected]
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
        pass  # No cleanup needed 