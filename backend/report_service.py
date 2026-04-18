import os
import datetime
from google import genai
from google.genai import types

class ReportService:
    def __init__(self):
        # Uses standard environment variable GOOGLE_API_KEY implicitly via genai.Client()
        self.api_key = os.environ.get("GOOGLE_API_KEY")
        try:
            self.client = genai.Client() if self.api_key else None
        except Exception:
            self.client = None

    def generate_risk_report(self, matched_asset_id: str, similarity: float) -> str:
        """Uses Gemini 1.5 Flash to automatically generate a Risk Report."""
        
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        prompt = f"""
        You are an elite digital forensics expert for VaultVision.
        Generate a professional, structured 'Risk Report' for a detected copyright infringement.
        
        Context details:
        - Official Original Asset ID: {matched_asset_id}
        - Similarity Score: {similarity * 100:.1f}% (Calculated via Vector Distance)
        - Timestamp: {timestamp}
        
        Requirements:
        Write the report purely in Markdown format.
        Determine the 'Risk Level' (HIGH if > 90%, MEDIUM if > 85%).
        Write a short forensic hypothesis explaining what methods might have been used to disguise the image (cropping, color shifts).
        List clear next steps for the legal team.
        """
        
        if not self.client:
            # Fallback response for dev when API key is missing
            return f"""# 🚨 VaultVision Intellectual Property Risk Report
**Time of Detection:** {timestamp}
**Official Source Asset:** `{matched_asset_id}`
**AI Match Confidence:** {similarity * 100:.1f}% Match
**Risk Assessment:** **HIGH RISK**

> [!WARNING]
> Generated in Developer Mock Mode (no `GOOGLE_API_KEY` provided). 

## Forensic Hypothesis
Based on the high CLIP vector distance, the suspect media heavily leverages structural elements from the original asset. Likely modifications include non-uniform cropping, brightness adjustment, and potential watermark obfuscation to avoid basic cryptographic hashing.

## Recommended Action
1. **Log Incident:** Hash and archive suspect file to cold storage.
2. **Issue Notice:** Prepare Automated DMCA Takedown Notice targeting the host domain.
3. **Monitor:** Add domain to elevated risk watch list.
"""

        try:
            # Call real Gemini integration
            response = self.client.models.generate_content(
                model='gemini-1.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.2)
            )
            return response.text
        except Exception as e:
            return f"# ❌ Evidence Engine Error\nAn error occurred communicating with Vertex AI/Gemini: {str(e)}"

# Singleton Instance
report_service = ReportService()
