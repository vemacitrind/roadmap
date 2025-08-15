from openai import OpenAI # type: ignore
import os 
from dotenv import load_dotenv  # type: ignore

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_custom_roadmap(prompt):
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # or "gpt-4"
        messages=[
            {"role": "system", "content": "You are an expert roadmap planner."},
            {"role": "user", "content": f"Create a learning roadmap for: {prompt}"}
        ],
        temperature=0.7,
        max_tokens=1000
    )
    return response.choices[0].message.content.strip()
