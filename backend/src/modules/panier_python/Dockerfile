FROM python:3.11-slim-bookworm

WORKDIR /usr/src/app

COPY . .

RUN apt-get update && apt-get install -y mariadb-client libmariadb-dev gcc

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

EXPOSE 6004

CMD ["python", "app.py"]