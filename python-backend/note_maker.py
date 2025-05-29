import os
import subprocess
import cv2
import torch
import whisper
from PIL import Image
from PyPDF2 import PdfReader
from docx import Document
from dotenv import load_dotenv
from moviepy.editor import VideoFileClip
from openai import OpenAI
from paddleocr import PaddleOCR
from transformers import CLIPModel, CLIPProcessor
from ultralytics import YOLO

# Load environment variables from .env.local
load_dotenv('.env.local')

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
if not client.api_key:
    raise ValueError("API key not found. Please ensure your .env.local file contains the OPENAI_API_KEY variable.")

# Initialize models
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Initialize PaddleOCR with CPU
ocr = PaddleOCR(use_gpu=False, use_angle_cls=True, lang="en")  # GPU disabled for PaddleOCR

# Initialize YOLO
yolo_model = YOLO("yolov5s.pt")

# Helper Functions
def extract_audio_from_video(video_path: str, output_audio_path: str):
    """Extract audio from a video file."""
    video = VideoFileClip(video_path)
    video.audio.write_audiofile(output_audio_path)

def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio using Whisper."""
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"]

def extract_text_from_file(file_path: str) -> str:
    """Extract text from supported file formats."""
    if file_path.endswith(".txt"):
        with open(file_path, "r") as f:
            return f.read()
    elif file_path.endswith(".pdf"):
        reader = PdfReader(file_path)
        return " ".join([page.extract_text() for page in reader.pages])
    elif file_path.endswith(".docx"):
        doc = Document(file_path)
        return " ".join([p.text for p in doc.paragraphs])
    else:
        raise ValueError("Unsupported file format.")

def analyze_image(image_path: str) -> str:
    """
    Analyze an image by combining OCR (text extraction), object detection, and CLIP for contextual alignment.
    """
    # Load the image for CLIP processing
    image = Image.open(image_path).convert("RGB")  # For CLIP
    cv2_image = cv2.imread(image_path)  # For YOLO

    # Preprocess image for CLIP
    clip_inputs = clip_processor(images=image, return_tensors="pt").to(device)

    # Step 1: Detect text using PaddleOCR
    print("Detecting text...")
    ocr_results = ocr.ocr(image_path)  # Pass the file path directly to PaddleOCR
    detected_text = [line[1][0] for line in ocr_results[0]]

    # Step 2: Detect objects using YOLO
    print("Detecting objects...")
    yolo_results = yolo_model(cv2_image)  # Use the cv2 image directly for YOLO
    detected_objects = []
    for result in yolo_results:
        if hasattr(result, "boxes") and result.boxes is not None:
            detected_objects.extend([box["name"] for box in result.boxes.data])

    # Step 3: Contextualize using CLIP
    print("Aligning with CLIP...")
    clip_prompts = detected_objects + detected_text
    clip_prompts = [f"This contains {item}" for item in clip_prompts]

    # Preprocess text prompts with truncation and padding enabled
    text_inputs = clip_processor(
        text=clip_prompts, return_tensors="pt", truncation=True, padding=True
    ).to(device)

    with torch.no_grad():
        image_features = clip_model.get_image_features(**clip_inputs)
        text_features = clip_model.get_text_features(**text_inputs)
        similarities = (text_features @ image_features.T).softmax(dim=-1)

    # Step 4: Rank items by relevance
    ranked_items = sorted(
        zip(clip_prompts, similarities.squeeze().tolist()),
        key=lambda x: x[1],
        reverse=True,
    )

    # Prepare final output
    ranked_info = "\n".join([f"{item[0]} (Relevance: {item[1]:.2f})" for item in ranked_items])

    # Combine everything into a structured analysis
    analysis = f"Text Detected: {', '.join(detected_text)}\n\n" \
               f"Objects Detected: {', '.join(detected_objects)}\n\n" \
               f"Contextual Information (Ranked):\n{ranked_info}"

    return analysis

def convert_video_to_mp4(input_path: str, output_path: str):
    """Convert video to MP4 using FFmpeg."""
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-i", input_path,
                "-c:v", "libx264",
                "-c:a", "aac",
                output_path
            ],
            check=True  
        )
        print(f"Video converted: {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"Video conversion failed: {e}")
        raise

def generate_summary_and_notes(file_type: str, content: str = "", image_analysis: str = "", user_request: str = "") -> str:
    """Generate a single summary and detailed bullet point notes."""

    # Base prompt
    prompt = f"Analyze this {file_type} to create one summary and detailed notes\n\n"

    # Prioritize user request
    if user_request:
        prompt += f"Prioritize this:\n{user_request}\n\n"

    # Add text content
    if content:
        prompt += f"Text Content:\n{content}\n\n"
    
    # Add image analysis if applicable
    if image_analysis:
        prompt += f"Visual Information:\n{image_analysis}\n"
    
    # Call the OpenAI API to generate notes
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": f"You create structured notes and summaries for {file_type}"},
            {"role": "user", "content": prompt},
        ],
        model="gpt-3.5-turbo-16k",
        max_tokens=1500,
        temperature=0.7,
    )
    print(f"{file_type.capitalize()} notes generated")
    return response.choices[0].message.content.strip()


# Core Processing Function
def process_input(file_path: str, file_type: str, user_request: str = "") -> str:
    """Process input based on its type and generate a single set of notes at the end."""
    content = ""  
    image_analysis = ""  

    if file_type == "text":
        # Process text files
        content = extract_text_from_file(file_path)
        print("Text information collected")
    
    elif file_type == "image":
        # Process images
        image_analysis = analyze_image(file_path)
        print("Image information collected")
    
    elif file_type == "video":
        # Convert video to MP4 for consistency
        converted_video_path = "media/converted_video.mp4"
        try:
            convert_video_to_mp4(file_path, converted_video_path)
            print("Video conversion completed")

            # Step 1: Extract audio and transcribe
            audio_path = "media/temp_audio.wav"
            try:
                extract_audio_from_video(converted_video_path, audio_path)
                content = transcribe_audio(audio_path)
                print("Audio transcription completed")
            finally:
                # Clean up the extracted audio file
                if os.path.exists(audio_path):
                    os.remove(audio_path)
        finally:
            # Always clean up the converted video file
            if os.path.exists(converted_video_path):
                os.remove(converted_video_path)
                print(f"Cleaned up {converted_video_path}")

    else:
        raise ValueError("Unsupported file type.")

    # Final Step: Generate unified notes
    return generate_summary_and_notes(file_type, content, image_analysis, user_request)

# Main Function
if __name__ == "__main__":
    # Ensure necessary folders exist
    os.makedirs("media", exist_ok=True)
    os.makedirs("output", exist_ok=True)

    # Initialize variables
    file_path = None  
    content = ""  
    output_path = "output/generated_notes.txt"

    print("Welcome to the Notetaker Platform!")

    # Get file type
    while True:
        file_type = input("What will you be creating notes from? (text, image, video): ").lower()
        if file_type in ["text", "image", "video"]:
            break
        print("Error: Unsupported file type. Please try again.")

    # Handle file input based on type
    while True:
        if file_type == "text":
            choice = input("Do you want to paste the text directly or upload a text file? (paste/upload): ").lower()
            if choice == "paste":
                print("Paste your text below. Press Enter when done:")
                while True:
                    content = input().strip()  # Ensure no empty input
                    if content:
                        break
                    print("Error: You must paste some text. Please try again.")
                break  # Exit the main loop for text processing
            elif choice == "upload":
                while True:
                    file_path = input("Enter the path to the text file: ")  # Correct variable
                    if os.path.exists(file_path):
                        break
                    print("Error: Text file not found. Please try again.")
                break  # Exit the main loop for text processing
            else:
                print("Error: Invalid choice. Please choose either 'paste' or 'upload'.")
        elif file_type == "image":
            while True:
                file_path = input("Enter the path to the image file: ")
                if os.path.exists(file_path):
                    break
                print("Error: Image file not found. Please try again.")
            break  # Exit the main loop for image processing
        elif file_type == "video":
            while True:
                file_path = input("Enter the path to the video file: ")
                if os.path.exists(file_path):
                    break
                print("Error: Video file not found. Please try again.")
            break  # Exit the main loop for video processing

    # Get any user requests
    user_request = input("Enter any specific requests to prioritize in the notes (optional): ")

    # Generate notes
    try:
        notes = process_input(file_path, file_type, user_request) if file_type != "text" or not content else generate_summary_and_notes(file_type, content, "", user_request)
        
        # Save notes to output file
        with open(output_path, "w") as f:
            f.write(notes)
        print(f"Notes saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

