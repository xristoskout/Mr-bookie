from fastapi import FastAPI, Request
# ADD THIS IMPORT
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import requests
from google.cloud import secretmanager
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import service_account

app = FastAPI()

# --- ADD CORS MIDDLEWARE CONFIGURATION ---
origins = [
    "https://xristoskout.github.io", # Allow your specific frontend origin
    # You might also want to allow localhost for local development
    "http://localhost",
    "http://localhost:8080", # Or whatever port you use locally
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # List of origins allowed
    allow_credentials=True, # Allow cookies (if needed)
    allow_methods=["*"],    # Allow all methods (GET, POST, OPTIONS, etc.) or specify ["POST", "OPTIONS"]
    allow_headers=["*"],    # Allow all headers or specify ["Content-Type", etc.]
)
# --- END CORS MIDDLEWARE CONFIGURATION ---


PROJECT_ID = "bookie-project-450910"
AGENT_ID = "85683470-0706-49d9-83e1-19ed85087c94"
LANGUAGE_CODE = "el"

# ... (rest of your get_credentials, get_access_token, chat_with_bot functions remain the same) ...

@app.post("/chat")
async def chat_with_bot(request: Request):
    # ... (your existing function code) ...
    body = await request.json()
    user_text = body.get("message")
    session_id = body.get("session_id", "default-session")

    try:
        access_token = get_access_token()
    except Exception as e:
        print(f"Failed to get access token: {e}")
        return {"queryResult": {"fulfillmentText": "Σφάλμα: δεν μπόρεσα να πάρω access token."}}

    endpoint = f"https://dialogflow.googleapis.com/v3/projects/{PROJECT_ID}/locations/global/agents/{AGENT_ID}/sessions/{session_id}:detectIntent"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "queryInput": {
            "text": {
                "text": user_text
            },
            "languageCode": LANGUAGE_CODE
        }
    }

    response = requests.post(endpoint, headers=headers, json=payload)

    if response.status_code != 200:
        print(f"Dialogflow error: {response.text}")
        return {"queryResult": {"fulfillmentText": "Σφάλμα επικοινωνίας με τον Mr. Bookie."}}

    return response.json()

