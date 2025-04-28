import { spawn } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    // Create a Python process to run the analysis
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'interview_analyzer.py'),
      text
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    return new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          return res.status(500).json({ 
            message: 'Analysis failed', 
            error: error || 'Unknown error occurred'
          });
        }

        try {
          const analysis = JSON.parse(result);
          if (analysis.error) {
            return res.status(500).json({ 
              message: 'Analysis failed', 
              error: analysis.error 
            });
          }
          return res.status(200).json(analysis);
        } catch (e) {
          return res.status(500).json({ 
            message: 'Failed to parse analysis results', 
            error: e.message 
          });
        }
      });
    });
  } catch (error) {
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
} 