# main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from google.cloud import secretmanager
from google.oauth2 import service_account
from google.auth.transport.requests import Request as GoogleRequest
import json

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Google Cloud settings
PROJECT_ID = "bookie-project-450910"
AGENT_ID = "85683470-0706-496f-a7a9-c5efb9c09a45"
LANGUAGE_CODE = "el"
SECRET_ID = "bookie-service-account"

def get_access_token():
    client = secretmanager.SecretManagerServiceClient()
    secret_name = f"projects/{PROJECT_ID}/secrets/{SECRET_ID}/versions/latest"
    response = client.access_secret_version(request={"name": secret_name})
    secret_payload = response.payload.data.decode("UTF-8")
    
    service_account_info = json.loads(secret_payload)

    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    credentials.refresh(GoogleRequest())
    return credentials.token

@app.post("/chat")
async def chat_with_bot(request: Request):
    body = await request.json()
    user_text = body.get("message")
    session_id = body.get("session_id", "123456789")

    access_token = get_access_token()

    endpoint = (
    f"https://dialogflow.googleapis.com/v3/projects/"
    f"bookie-project-450910/locations/global/agents/85683470-0706-496f-a7a9-c5efb9c09a45/sessions/{session_id}:detectIntent"

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

# === Προσθήκη σωστής εκκίνησης για Cloud Run ===
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080)

