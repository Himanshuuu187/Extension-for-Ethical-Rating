import requests

def load_lottieurl(url: str):
    
    try:
        response = requests.get(url)
        if response.status_code != 200:
            return None
        return response.json()
    except:
        return None
