"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function AnalysisResults() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get analysis data from localStorage
    const storedAnalysis = localStorage.getItem('interviewAnalysis');
    if (storedAnalysis) {
      setAnalysis(JSON.parse(storedAnalysis));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
        <div className="text-2xl font-semibold">Loading analysis results...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFCFC]">
        <div className="text-2xl font-semibold mb-4">No analysis results found</div>
        <button
          onClick={() => router.push('/video_interview')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Start New Interview
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h1 className="text-3xl font-bold mb-6">Interview Analysis Results</h1>

          {/* Grammar Analysis */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Grammar Analysis</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-lg mb-2">
                Total Grammar Issues: {analysis.grammar_check.length}
              </p>
              {analysis.grammar_check.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-medium mb-2">Issues Found:</h3>
                  <ul className="space-y-2">
                    {analysis.grammar_check.map((issue, index) => (
                      <li key={index} className="bg-white p-3 rounded-md shadow-sm">
                        <p className="font-medium">{issue.message}</p>
                        {issue.suggestions && issue.suggestions.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Suggestions: {issue.suggestions.join(', ')}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Sentiment Analysis */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Sentiment Analysis</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-lg mb-2">
                Overall Sentiment: {analysis.sentiment.overall}
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-600">Positive</p>
                  <p className="text-lg font-medium">
                    {(analysis.sentiment.scores.pos * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-600">Neutral</p>
                  <p className="text-lg font-medium">
                    {(analysis.sentiment.scores.neu * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-600">Negative</p>
                  <p className="text-lg font-medium">
                    {(analysis.sentiment.scores.neg * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Filler Words Analysis */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Filler Words Analysis</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-lg mb-2">
                Total Filler Words: {analysis.filler_words.length}
              </p>
              {analysis.filler_words.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-medium mb-2">Filler Words Found:</h3>
                  <ul className="space-y-2">
                    {analysis.filler_words.map((filler, index) => (
                      <li key={index} className="bg-white p-3 rounded-md shadow-sm">
                        <p className="font-medium">{filler.word}</p>
                        <p className="text-sm text-gray-600">
                          Position: {filler.position}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Linguistic Analysis */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Linguistic Analysis</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-600">Sentence Count</p>
                  <p className="text-lg font-medium">
                    {analysis.linguistic_analysis.sentence_count}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-sm text-gray-600">Word Count</p>
                  <p className="text-lg font-medium">
                    {analysis.linguistic_analysis.word_count}
                  </p>
                </div>
              </div>
              {analysis.linguistic_analysis.entities.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xl font-medium mb-2">Entities Found:</h3>
                  <ul className="space-y-2">
                    {analysis.linguistic_analysis.entities.map((entity, index) => (
                      <li key={index} className="bg-white p-3 rounded-md shadow-sm">
                        <p className="font-medium">{entity[0]}</p>
                        <p className="text-sm text-gray-600">Type: {entity[1]}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => router.push('/video_interview')}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Start New Interview
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('interviewAnalysis');
                router.push('/');
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Results
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 