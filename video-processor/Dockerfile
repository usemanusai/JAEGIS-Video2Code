# Video Processor Dockerfile
FROM python:3.13-slim

# Install runtime dependencies for OpenCV
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       libgl1 \
       libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python","-m","flask","--app","api","run","--host","0.0.0.0","--port","5000"]

