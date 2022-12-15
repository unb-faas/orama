FROM index.docker.io/justb4/jmeter:5.3
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Benchmarker Worker"
RUN apk update && apk add npm
WORKDIR "/benchmarker_worker/src"
COPY src/package.json /benchmarker_worker/src
RUN npm install
COPY . /benchmarker_worker
ENTRYPOINT [ "node", "index.js" ]
