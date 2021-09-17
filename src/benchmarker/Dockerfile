FROM justb4/jmeter:5.3
LABEL application="Orama"
LABEL maintainer="University of Brasilia"
LABEL component="Benchmarker"

#COPY requirements.txt .
#RUN apk update \
#	&& apk upgrade
#RUN apk add python3 gcc libgc++ py3-configobj libusb py3-pip python3-dev gcc linux-headers libc-dev musl-dev
#RUN pip install --upgrade pip
#RUN pip install -U setuptools
#RUN pip install Cheetah
#RUN pip install pyusb
#RUN pip install --no-cache-dir -r requirements.txt
RUN apk update \ 
    && apk add npm

WORKDIR "/benchmarker"
COPY . /benchmarker
RUN npm i
ENTRYPOINT [ "node", "index.js" ]
#CMD uvicorn main --host 0.0.0.0 --port 6000 --reload --workers 8