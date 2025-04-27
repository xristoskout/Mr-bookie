# save as main.py

from fastapi import FastAPI, Request
import google.auth
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import service_account
import requests
import os

app = FastAPI()

# Φόρτωσε το service account JSON αρχείο
SERVICE_ACCOUNT_FILE = "bookie-project-450910-8543366a5c3f.json"  # Εδώ δίνεις το δικό σου .json
PROJECT_ID = "bookie-project-450910"
AGENT_ID = "85683470-0706-496f-a7a9-c5efb9c09a45"
LANGUAGE_CODE = "el"

# Κάνουμε authentication για να πάρουμε access token
def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    credentials.refresh(GoogleRequest())
    return credentials.token

@app.post("/chat")
async def chat_with_bot(request: Request):
    body = await request.json()
    user_text = body.get("message")

    access_token = get_access_token()

    endpoint = f"https://us-central1-dialogflow.googleapis.com/v3/projects/bookie-project-450910/locations/global/agents/85683470-0706-496f-a7a9-c5efb9c09a45/sessions/123456789:detectIntent"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "queryInput": {
            "text": {
                "text": user_text,
                "languageCode": LANGUAGE_CODE
            }
        }
    }

    response = requests.post(endpoint, headers=headers, json=payload)

    return response.json()
