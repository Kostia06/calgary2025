import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
from io import BytesIO
from PIL import Image
from geopy.geocoders import Nominatim
import requests
from bs4 import BeautifulSoup
from transformers import BartTokenizer

PEXELS_API_KEY = ""
Huggingface_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
headers = {"Authorization": "Bearer "}  # Replace with your token

# Load the tokenizer for facebook/bart-large-cnn
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")
max_tokens = 900  # approximate token limit for the model

def trim_text(text, tokenizer, max_tokens):
    tokens = tokenizer.encode(text, truncation=False)
    if len(tokens) > max_tokens:
        tokens = tokens[:max_tokens]
        trimmed_text = tokenizer.decode(tokens, skip_special_tokens=True)
        return trimmed_text
    return text

def summarize_text(text):
    # Trim text to avoid exceeding token limits
    trimmed_text = trim_text(text, tokenizer, max_tokens)
    prompt = (
        f"Please provide a summary of the text with an emphasis wildlife details:\n\n{trimmed_text}"
    )
    payload = {"inputs": prompt}
    response = requests.post(Huggingface_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    summary = response.json()[0]['summary_text']
    return summary

def get_location(location):
    geolocator = Nominatim(user_agent="geo_scraper")
    loc = geolocator.geocode(location)
    if loc:
        return loc.latitude, loc.longitude
    return None

def get_location_image(query):
    url = "https://api.pexels.com/v1/search"
    headers_image = {"Authorization": PEXELS_API_KEY}
    params = {"query": query, "per_page": 1}  # Get one image per query
    response = requests.get(url, headers=headers_image, params=params)
    data = response.json()
    if data.get("photos"):
        image_url = data["photos"][0]["src"]["large"]
        img_response = requests.get(image_url)
        img = Image.open(BytesIO(img_response.content))
        return img
    return None

def get_wikipedia_summary(location):
    url = f"https://en.wikipedia.org/wiki/{location.replace(' ', '_')}"
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        # Locate the main content section
        content_div = soup.find('div', id='mw-content-text')
        if not content_div:
            return "No information found."
        # Gather all paragraphs within the content area
        paragraphs = content_div.find_all('p')
        article_text = "\n\n".join(
            [p.get_text().strip() for p in paragraphs if p.get_text().strip()]
        )
        return article_text if article_text else "No information found."
    return "No information found."

# Main execution
location = "Banff National Park"
coords = get_location(location)
print(f"Coordinates of {location}: {coords}")

image = get_location_image(location)
if image:
    image.show()
else:
    print("No image found.")

info = get_wikipedia_summary(location)
print("got info from wiki")
summaryOfInfo = summarize_text(info)
print(summaryOfInfo)


