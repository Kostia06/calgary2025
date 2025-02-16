from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from AI import modelRunner
from Webscrapper import scrapper
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

def get_ngrok_url():
    """Fetch the public Ngrok URL if Ngrok is running."""
    try:
        response = requests.get("http://localhost:4040/api/tunnels")
        response.raise_for_status()
        tunnels = response.json().get("tunnels", [])
        if tunnels:
            return tunnels[0]["public_url"]  # First tunnel is usually the correct one
    except requests.RequestException:
        return None  # Ngrok is not running or unavailable

@app.route('/test')
def test():
    return "test"

@app.route('/process_image', methods=["POST"])
def process_image():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400

    image_url = data.get('url')
    if not image_url:
        return jsonify({'error': 'No URL provided'}), 400

    # Download the image
    image_path = 'downloaded_image.jpg'
    response = requests.get(image_url)

    if response.status_code == 200:
        with open(image_path, 'wb') as file:
            file.write(response.content)
    else:
        return jsonify({'error': 'Failed to download image'}), 500

    result = modelRunner.predict(image_path)

    if not result:
        return jsonify({'error': 'Unable to run classification model, unknown error'}), 500
    return jsonify(result)

@app.route('/webscrape_location', methods=['POST'])
def webscrape_location():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400

    location = data.get('location')
    if not location:
        return jsonify({'error': 'No location provided'}), 400

    result = scrapper.get_location_info(location, get_ngrok_url())
    return jsonify(result)


@app.route('/uploads/<filename>', methods=['GET'])
def return_img(filename):
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)