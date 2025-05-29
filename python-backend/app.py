from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from note_maker import process_input

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend interaction

@app.route('/', methods=['GET'])
def home():
    """
    Default route to indicate the API is running.
    """
    return jsonify({"message": "Welcome to the NotePal API!"}), 200

@app.route('/favicon.ico', methods=['GET'])
def favicon():
    """
    Route to serve the favicon.
    """
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico',
        mimetype='image/vnd.microsoft.icon'
    )

@app.route('/api/process', methods=['POST'])
def process():
    """
    Endpoint to process text, image, or video and generate notes.
    """
    data = request.json
    file_type = data.get("file_type")
    file_path = data.get("file_path")
    user_request = data.get("user_request", "")

    if not file_type or not file_path:
        return jsonify({"error": "file_type and file_path are required"}), 400

    if file_type not in ["text", "image", "video"]:
        return jsonify({"error": "Invalid file_type. Must be 'text', 'image', or 'video'"}), 400

    try:
        result = process_input(file_path, file_type, user_request)
        return jsonify({"result": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Endpoint to check if the backend is running.
    """
    return jsonify({"status": "running"}), 200

if __name__ == '__main__':
    app.run(debug=True)
