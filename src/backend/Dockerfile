FROM index.docker.io/library/node:14-slim
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Backend"
WORKDIR "/backend"
COPY package.json /backend/package.json
RUN npm i knex -g
# AARM64 - Apple Silicon
# RUN apt-get update && apt-get install -y software-properties-common gcc python3.6 python3-distutils python3-pip python3-apt
RUN npm i --no-optional
# AARM64 - Apple Silicon
# RUN apt-get clean && apt-get autoremove --purge && apt-get remove -y software-properties-common gcc python3.6 python3-distutils python3-pip python3-apt && apt-get autoremove -y
COPY . /backend
EXPOSE 3001
CMD knex migrate:latest && npm start