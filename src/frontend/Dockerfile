FROM node:16-slim
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Frontend"
WORKDIR "/frontend"
COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json
#RUN npx npm-force-resolutions ; npm install --no-optional && npm run-script build && npm cache clean --force && echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf 
RUN npm install --no-optional && npm i -D chokidar && echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf 
COPY . /frontend
EXPOSE 3000
CMD npm start