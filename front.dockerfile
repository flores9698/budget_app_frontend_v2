## Build
# docker build -t frontend:0.1.0 -f front.dockerfile .

## Run
# docker run -p 3000:3000 -d frontend:0.1.0 

FROM node:16-stretch-slim


#Copy Application
COPY . /opt/app

WORKDIR /opt/app

RUN npm install 

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s","build"]