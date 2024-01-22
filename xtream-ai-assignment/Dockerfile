FROM python:3.11-slim-bookworm as server

ENV HOST="0.0.0.0"
ENV PORT=8080
ENV PYTHONPATH=.
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt-get update && \
    apt-get install -y python3-dev gcc pkg-config build-essential ffmpeg libsm6 libxext6 curl
RUN mkdir code

WORKDIR /code

RUN pip install --upgrade pip && pip install pip-tools

COPY ./requirements.txt /code/requirements.txt
RUN pip-sync requirements.txt

COPY . /code

EXPOSE 8080

CMD uvicorn main:app --host $HOST --port $PORT --reload