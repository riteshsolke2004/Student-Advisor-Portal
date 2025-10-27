# ================================
# 1. Base image
# ================================
FROM python:3.11-slim

# ================================
# 2. Working directory
# ================================
WORKDIR /app

# ================================
# 3. Install system dependencies
# ================================
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ================================
# 4. Install Python dependencies
# ================================
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ================================
# 5. Copy application code
# ================================
COPY . .

# ================================
# 6. Expose port & run
# ================================
EXPOSE 8080
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]
