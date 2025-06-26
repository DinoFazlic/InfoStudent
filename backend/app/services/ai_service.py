import os
import requests

def generate_ai_prompt(description: str) -> str:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    print("GROQ_API_KEY:", GROQ_API_KEY)

    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama3-8b-8192", 
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a career-advisor AI. Analyse the description and give up to 6 concise bullet-point tips (max 25 words each)."
                )
            },
            {
                "role": "user",
                "content": (
                    f"Analyze the following job description and suggest how a student can best prepare for this job. "
                    f"Additionally, provide specific tips on how the student can maximize their chances of success when applying, "
                    f"such as resume improvements, cover letter suggestions, or portfolio advice. "
                    f"Give clear, detailed, and actionable advice:\n\n{description}"
                )

            }
        ],
        "temperature": 0.7,
        "max_tokens": 300
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code != 200:
        print("Groq API Error:", response.status_code, response.text)
        raise Exception("Groq API failed")

    result = response.json()
    return result["choices"][0]["message"]["content"].strip()
