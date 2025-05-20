import os
import requests
import base64

STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")

def generate_avatar_image(prompt: str, user_id: int) -> str:
    url = "https://api.stability.ai/v2beta/stable-image/generate/core"

    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
        "Accept": "application/json"
    }

    files = {
        'prompt': (None, prompt),
        'model': (None, 'stable-diffusion-xl-v1-0'),
        'aspect_ratio': (None, '1:1'),
        'output_format': (None, 'png'),
    }

    response = requests.post(url, headers=headers, files=files)

    if response.status_code != 200:
        print("Image generation failed:", response.status_code, response.text)
        raise Exception("Image generation failed")

    image_base64 = response.json().get("image")
    if not image_base64:
        raise Exception("No image returned from API")

    output_folder = "app/static/profile_photos"
    os.makedirs(output_folder, exist_ok=True)
    output_path = f"{output_folder}/user_{user_id}_avatar.png"

    with open(output_path, "wb") as f:
        f.write(base64.b64decode(image_base64))

    return f"/static/profile_photos/user_{user_id}_avatar.png"
