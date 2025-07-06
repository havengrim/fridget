import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

def fetch_unsplash_image(query):
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "client_id": UNSPLASH_ACCESS_KEY,
        "per_page": 1,
        "orientation": "landscape",
    }
    try:
        res = requests.get(url, params=params, timeout=5)
        res.raise_for_status()
        results = res.json().get("results", [])
        if results:
            return results[0]["urls"]["regular"]
        else:
            return "No image found"
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    search_term = input("Enter a search term for Unsplash image: ")
    if not UNSPLASH_ACCESS_KEY:
        print("Error: UNSPLASH_ACCESS_KEY not found in environment variables")
    else:
        image_url = fetch_unsplash_image(search_term)
        print(f"Image URL for '{search_term}': {image_url}")
