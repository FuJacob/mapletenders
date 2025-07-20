FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy all code
COPY . .

EXPOSE 8000

CMD ["python", "main.py"]