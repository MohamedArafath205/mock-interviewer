from interview_analyzer import InterviewAnalyzer

def main():
    # Initialize the analyzer
    analyzer = InterviewAnalyzer()
    
    # Test text
    test_text = "Um, I think like, you know, I have good experience in project management and stuff."
    
    try:
        # Analyze the text
        results = analyzer.analyze_text(test_text)
        
        # Print detailed results
        print("\nAnalysis Results for:", test_text)
        print("\n1. Grammar Check:")
        for issue in results['grammar_check']:
            print(f"- {issue['message']}")
            if issue['suggestions']:
                print(f"  Suggestions: {', '.join(issue['suggestions'])}")
        
        print("\n2. Sentiment Analysis:")
        print(f"- Overall: {results['sentiment']['overall']}")
        print(f"- Scores: {results['sentiment']['scores']}")
        
        print("\n3. Filler Words:")
        for filler in results['filler_words']:
            print(f"- Found '{filler['word']}' at position {filler['position']}")
        
        print("\n4. Linguistic Analysis:")
        print(f"- Sentence Count: {results['linguistic_analysis']['sentence_count']}")
        print(f"- Word Count: {results['linguistic_analysis']['word_count']}")
        print("- Entities Found:")
        for entity in results['linguistic_analysis']['entities']:
            print(f"  * {entity[0]} ({entity[1]})")
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
    finally:
        # Clean up resources
        analyzer.cleanup()

if __name__ == "__main__":
    main() 