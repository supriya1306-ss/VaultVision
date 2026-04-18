FROM python:3.11-slim

# Set working directory to the parent so that python can resolve 'backend' module
WORKDIR /app

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install dependencies
# (We install torch with cpu-only to keep image size manageable, though for GCP sometimes standard works)
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the python files into a 'backend' subfolder inside /app
# This matches the Python import structures (like "from backend.api import router")
COPY . /app/backend

# Inform Python where to find the modules
ENV PYTHONPATH=/app

# Cloud Run injects a PORT environment variable, defaulting to 8080 usually, 
# but we map uvicorn to 8080.
ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
