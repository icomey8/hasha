FROM python:3.13-alpine

WORKDIR /code

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt && \
    rm -rf /root/.cache/pip

COPY . .

CMD ["fastapi", "run", "app/main.py", "--port", "80", "--reload"]