import os
import requests
from dotenv import load_dotenv
import re

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def parse_markdown_to_json(md_text):
    """
    Parses markdown text into a dict:
    Keys: Section names (Functional Requirements, Non-Functional Requirements, Business Rules, Constraints, Assumptions)
    Values: List of bullet point strings under each section
    """
    # Flexible split for headers with optional #, : or - suffix, case insensitive
    pattern = re.compile(
        r"(?:^|\n)\s*(?:#+\s*)?"
        r"(Functional Requirements|Non-Functional Requirements|Business Rules|Constraints|Assumptions)"
        r"\s*[:\-]?\s*(?:\n|$)",
        flags=re.IGNORECASE,
    )

    splits = pattern.split(md_text)
    # splits example: [before first header text, header1, content1, header2, content2, ...]

    parsed = {}
    for i in range(1, len(splits), 2):
        section = splits[i].strip()
        content = splits[i+1].strip()

        lines = content.splitlines()
        items = []
        for line in lines:
            line = line.strip()
            # Match bullet points starting with -, *, or numbered lists (e.g., 1. )
            match = re.match(r"^(\*|-|\d+\.)\s+(.*)", line)
            if match:
                items.append(match.group(2).strip())
        parsed[section] = items

    return parsed

def extract_requirements(text):
    if not text.strip():
        return {"error": "Empty input text"}

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
You are an AI requirements analyst.

Extract and list clearly the following sections from the input text:
1. Functional Requirements
2. Non-Functional Requirements
3. Business Rules
4. Constraints
5. Assumptions

Output ONLY markdown with headers for each section (## Section Name) and bullet points starting with "- ".

Remove any personal or unrelated information.

Input text:
{text}
"""

    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.3,
        "max_tokens": 2048
    }

    try:
        response = requests.post(GROQ_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

        markdown_output = data["choices"][0]["message"]["content"].strip()

        # Debug print raw markdown output
        print("=== RAW MARKDOWN OUTPUT ===")
        print(markdown_output)
        print("===========================")

        # Parse markdown to structured dict
        parsed_requirements = parse_markdown_to_json(markdown_output)
        return parsed_requirements

    except requests.exceptions.RequestException as e:
        return {"error": f"Request error: {e}"}
    except (KeyError, IndexError) as e:
        return {"error": f"Response parsing error: {e}", "raw_response": data}

# Example usage:
if __name__ == "__main__":
    sample_text = """
Develop AI-powered solutions for real-time health data analysis and defect detection in PCB manufacturing. Ensure high accuracy and scalability. Use Explainable AI for transparency. Constraints include limited data availability and computational resources. Assume availability of budget and expertise in AI.
"""
    results = extract_requirements(sample_text)
    print("\n=== PARSED REQUIREMENTS ===")
    print(results)
