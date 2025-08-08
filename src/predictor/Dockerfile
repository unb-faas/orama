FROM index.docker.io/library/python:3.11
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Predictor"
WORKDIR "/predictor"
COPY src/requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip cache purge
COPY src /predictor
ENTRYPOINT [ "python3", "main.py" ]

