FROM index.docker.io/justb4/jmeter:5.3
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Benchmarker"
RUN apk update && apk add npm
WORKDIR "/benchmarker/src"
COPY src/package.json /benchmarker/src
RUN npm install
COPY . /benchmarker
ENTRYPOINT [ "node", "index.js" ]
