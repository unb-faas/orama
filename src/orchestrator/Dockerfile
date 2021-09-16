FROM node:16-slim
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Orchestrator"
WORKDIR "/orchestrator"
RUN apt-get update ; apt-get -y install curl grep unzip
RUN npm install terraform-latest
ENTRYPOINT ["tail", "-f", "/dev/null"]
