FROM index.docker.io/library/node:16.10.0-bullseye-slim
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Orchestrator"
WORKDIR "/orchestrator/src"
RUN apt-get update && apt-get -y install curl grep unzip zip rsync && apt-get clean
RUN npm install terraform-latest@0.1.15
COPY src/package.json /orchestrator/src
RUN npm install
COPY . /orchestrator
ENTRYPOINT [ "node", "index.js" ]
