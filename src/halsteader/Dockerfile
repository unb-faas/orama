FROM index.docker.io/library/node:16.10.0-bullseye-slim
LABEL application="Orama "
LABEL maintainer="University of Brasilia"
LABEL component="Halsteader"
WORKDIR "/halsteader"
COPY src/package.json /halsteader/package.json
RUN npm install --no-optional && npm cache clean --force 
COPY src /halsteader
EXPOSE 3000
CMD npm start