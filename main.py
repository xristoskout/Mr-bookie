# main.py

from fastapi import FastAPI, Request
import requests
import google.auth
from google.auth.transport.requests import Request as GoogleRequest

app = FastAPI()

# Πληροφορίες Project και Agent
PROJECT_ID = "bookie-project-450910"
AGENT_ID = "85683470-0706-496f-a7a9-c5efb9c09a45"
LANGUAGE_CODE = "el"

# Παίρνουμε το access token απευθείας από το περιβάλλον του Cloud Run
def get_access_token():
    credentials, _ = google.auth.default(scopes=["https://www.googleapis.com/auth/cloud-platform"])
    credentials.refresh(GoogleRequest())
    return credentials.token

@app.post("/chat")
async def chat_with_bot(request: Request):
    body = await request.json()
    user_text = body.get("message")
    session_id = body.get("session_id", "123456789")

    access_token = get_access_token()

    endpoint = (
        f"https://us-central1-dialogflow.googleapis.com/v3/projects/"
        f"{PROJECT_ID}/locations/global/agents/{AGENT_ID}/sessions/{session_id}:detectIntent"
    )

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

    if response.status_code != 200:
        return {"queryResult": {"fulfillmentText": "⚠️ Παρουσιάστηκε πρόβλημα στην επικοινωνία με τον agent."}}

    dialogflow_response = response.json()
    reply_text = dialogflow_response.get("queryResult", {}).get("fulfillmentText", "Δεν κατάλαβα, μπορείς να επαναλάβεις;")

    return {"queryResult": {"fulfillmentText": reply_text}}

@app.get("/")
def home():
    return {"message": "Mr Bookie API is running! 🚀"}

