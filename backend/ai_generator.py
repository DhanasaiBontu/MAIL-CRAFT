# backend/ai_generator.py

from typing import Dict

def generate_email(subject: str, recipient_name: str, message_context: str) -> Dict[str, str]:
    """
    Mock function to simulate AI-based email content generation.
    Replace this logic with real API calls (e.g., Gemini, GPT) later.
    """
    email_body = (
        f"Dear {recipient_name},\n\n"
        f"{message_context}\n\n"
        "Best regards,\n"
        "Your Email Assistant"
    )
    return {
        "subject": subject,
        "body": email_body
    }
