FROM node:16-slim
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Orchestrator"
WORKDIR "/orchestrator"
RUN apt-get update && apt-get -y install curl grep unzip && apt-get clean
RUN npm install terraform-latest
COPY package.json /orchestrator
RUN npm install
COPY . /orchestrator
CMD node index.js
