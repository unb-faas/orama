FROM python:3.11-slim
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Halsteader"
WORKDIR /halsteader
COPY src/requirements.txt /halsteader/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . /halsteader
EXPOSE 3000
ENV FLASK_APP=src/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=3000
ENV FLASK_DEBUG=1
CMD ["flask", "run"]
