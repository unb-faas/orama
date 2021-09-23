FROM node:16-slim
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Orchestrator"
WORKDIR "/orchestrator/src"
RUN apt-get update && apt-get -y install curl grep unzip zip rsync && apt-get clean
RUN npm install terraform-latest
COPY src/package.json /orchestrator/src
RUN npm install
COPY . /orchestrator
ENTRYPOINT [ "node", "index.js" ]
