# NotePal
---

## Description
NotePal is an AI-powered note-taking application that transforms text, images, audio, and video into concise, structured notes. It’s designed for students, professionals, and lifelong learners who want to save time and retain key information without manual effort.


## Features
- **Quiz Generation**: Automatically creates multiple-choice and short-answer quizzes based on uploaded content to reinforce learning.
- **Text Editor**: Rich text editor for manual note-taking, formatting, and organization.
- **Note Generation**: Summarizes documents, images, and transcribed audio/video into bullet-point notes using AI.
- **Chatbot Assistance**: Interactive chatbot that answers content-related questions and clarifies concepts in real time.
- **OCR & Object Detection**: Extracts text from images (PaddleOCR) and identifies objects (YOLOv5) for context-aware summaries.
- **Multi-Modal Input**: Supports `.txt`, `.pdf`, `.docx`, image, and video uploads to cover all content types seamlessly.


## Technologies Used

### Core
- Python (Flask): Backend API and note-generating logic
- Next.js (JavaScript/TypeScript): Frontend interface and routing
- Firebase: Stores user-uploaded files, handles real-time data sync, and manages backend storage
- NextAuth: Manages user authentication and session handling in the frontend (used for login, route protection, and session checks)
- OpenAI API: Text summarization, quiz creation, and chatbot responses


### Supporting
- LangChain: Manages chatbot logic and connects LLMs to external data
- Pinecone: Stores embeddings and retrieves relevant content for the chatbot
- Whisper: Transcribes audio from video files
- PaddleOCR: Extracts text from images
- CLIP: Selects relevant images based on text context
- YOLOv5: Detects objects in images
- MoviePy & FFmpeg: Convert videos to MP4 and extract audio
- PyPDF2 & python-docx: Read and extract text from PDF and Word files


## Installation
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/nicolasgioanni/NotePal.git
   cd NotePal
   ```

2. **Backend Setup**  
   - Create and activate a Python virtual environment:  
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```  
   - Install dependencies:  
     ```bash
     pip install --upgrade pip
     pip install -r requirements.txt
     ```  

3. **Frontend Setup**  
   - Navigate to the frontend folder (if separate):  
     ```bash
     cd frontend
     ```  
   - Install Node.js packages:  
     ```bash
     npm install
     ```  

4. **Environment Configuration**  
   - Create a `.env.local` file in the project root with:  
     ```env
     OPENAI_API_KEY=your_openai_api_key
     NEXTAUTH_URL=https://mynotepal.ai
     ```  
   - (Optional) If using AWS S3:  
     ```env
     AWS_ACCESS_KEY_ID=your_aws_access_key
     AWS_SECRET_ACCESS_KEY=your_aws_secret_key
     AWS_S3_BUCKET=your_s3_bucket_name
     ```  

5. **FFmpeg Installation**  
   - **macOS**:  
     ```bash
     brew install ffmpeg
     ```  
   - **Ubuntu/Debian**:  
     ```bash
     sudo apt-get install ffmpeg
     ```  
   - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/) and add to `PATH`.


## Usage
1. **Start the Backend**  
   ```bash
   export FLASK_APP=app.py
   export FLASK_ENV=development
   flask run
   ```  
   Backend runs at `http://localhost:5000`.

2. **Start the Frontend**  
   ```bash
   cd frontend
   npm run dev
   ```  
   Frontend runs at `http://localhost:3000`.

3. **Live Application**  
   - Access the live deployment at: [https://mynotepal.ai](https://mynotepal.ai)  
   - Sign up or log in to upload files, generate notes, and use the chatbot.

4. **API Example** (cURL)  
   ```bash
   curl -X POST http://localhost:5000/api/process      -H "Content-Type: application/json"      -d '{
           "file_type": "text",
           "file_path": "/absolute/path/to/file.pdf",
           "user_request": "Create a summary in bullet points"
         }'
   ```


## Core Functions
- **Note Generation**  
  - Processes text, images, and video to create structured notes.  
  - Orchestrates OCR, object detection, and text summarization pipelines.

- **Quiz Generation**  
  - Analyzes generated notes to produce multiple-choice and short-answer quizzes.

- **Interactive Chatbot**  
  - Responds to user queries based on processed content, leveraging OpenAI’s conversational models.

- **Document Parsing**  
  - Extracts text from PDFs and Word documents using `PyPDF2` and `python-docx`.

- **Image & Video Handling**  
  - Uses `PaddleOCR` and `YOLOv5` for image analysis; `Whisper` for audio transcription from videos.

- **User Authentication**  
  - Secures routes and API endpoints via NextAuth, ensuring only authenticated users can generate or view notes.


## Contributions
This project was founded and developed by **Parth Gupta** and **Nicolas Gioanni** to enhance learning and note-taking through AI. We welcome contributions! To contribute:

1. **Fork the repository**.  
2. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature
   ```  
3. Implement your changes and commit:  
   ```bash
   git commit -m "Add short description of changes"
   ```  
4. Push to your branch:  
   ```bash
   git push origin feature/your-feature
   ```  
5. Open a Pull Request against the `main` branch.

If you encounter bugs, have suggestions, or want to improve functionality, please open an issue. We will review and address contributions promptly.


## License
This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.
