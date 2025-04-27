import os
import subprocess
import sys
import time

def run_command(command):
    try:
        subprocess.run(command, shell=True, check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def setup_project():
    print("🚀 Starting project setup...")
    
    # 1. Create and activate virtual environment
    print("\n📦 Setting up virtual environment...")
    if not os.path.exists("venv"):
        run_command("python -m venv venv")
    
    # Activate virtual environment
    if sys.platform == "win32":
        activate_script = "venv\\Scripts\\activate"
    else:
        activate_script = "source venv/bin/activate"
    
    # 2. Install requirements
    print("\n📥 Installing requirements...")
    run_command(f"{activate_script} && pip install --upgrade pip")
    run_command(f"{activate_script} && pip install fastapi==0.104.1 uvicorn==0.24.0 python-multipart==0.0.6 openai==1.3.0 python-dotenv==1.0.0 pydantic==2.4.2 httpx==0.24.1 textblob==0.17.1 nltk==3.8.1 SpeechRecognition==3.10.0 PyAudio==0.2.13 requests==2.31.0")
    
    # 3. Download NLTK data
    print("\n📚 Downloading NLTK data...")
    run_command(f"{activate_script} && python -c \"import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger'); nltk.download('brown')\"")
    
    # 4. Download TextBlob data
    print("\n📚 Downloading TextBlob data...")
    run_command(f"{activate_script} && python -m textblob.download_corpora")
    
    # 5. Start the server
    print("\n🌐 Starting the server...")
    if sys.platform == "win32":
        server_command = f"{activate_script} && uvicorn main:app --reload"
    else:
        server_command = f"{activate_script} && uvicorn main:app --reload"
    
    # Start server in a new process
    server_process = subprocess.Popen(server_command, shell=True)
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(5)
    
    # 6. Run tests
    print("\n🧪 Running tests...")
    run_command(f"{activate_script} && python test_endpoints.py")
    
    print("\n✨ Setup complete! Server is running at http://localhost:8000")
    print("📝 API documentation available at http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        server_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Stopping server...")
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    setup_project() 