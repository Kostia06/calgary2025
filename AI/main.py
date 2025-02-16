import flask
import requests
import subprocess
import modelRunner

app = flask(__name__)

@app.route('/process_image', methods = ["POST"])
def process_image():
    data = request.get_json()
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

    #returns a dictionary
    if result == {}:
        return jsonify({'error': 'unable to run classification model, unknown error check terminal'}), 500
    return result



if __name__ == '__main__':
    app.run(debug=True)