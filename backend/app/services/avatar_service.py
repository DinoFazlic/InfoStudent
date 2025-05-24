import os
import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def generate_avatar_prompt(user_name: str) -> str:
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama3-70b-8192",  
        "messages": [
            {
                "role": "system",
                "content": "You generate creative prompts for cartoon-style digital avatars suitable for user profile pictures."
            },
            {
                "role": "user",
                "content": (
                    "Generate a short prompt for a flat, gender-neutral, cartoon-style avatar suitable for a student profile picture. "
                    "The avatar should be simple, abstract or symbolic, and not look like a real person. "
                    "Examples: a smiling robot, a colorful book with eyes, a pencil character, a friendly abstract shape with glasses. "
                    "Use clean, minimal design. Avoid fantasy elements and fancy clothes."
                )
            },
            {
                "role": "assistant",
                "content": f"Create a cartoon-style avatar for a student named {user_name}. The avatar should be simple, abstract or symbolic, and not look like a real person. Examples: a smiling robot, a colorful book with eyes, a pencil character, a friendly abstract shape with glasses. Use clean, minimal design. Avoid fantasy elements and fancy clothes."
            }   
        ],
        "temperature": 0.9,
        "max_tokens": 100
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code != 200:
        print("Groq API Error:", response.status_code, response.text)
        raise Exception("Groq API failed")

    result = response.json()
    return result["choices"][0]["message"]["content"].strip()
