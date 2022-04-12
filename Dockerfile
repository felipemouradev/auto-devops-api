FROM felipemouracv/k8s-helm-aws:3.8.1
WORKDIR /home/node/app
COPY . /home/node/app
RUN apk add --update nodejs npm
RUN npm config set unsafe-perm true
RUN npm install -g @nestjs/cli
RUN npm install yarn -g
RUN yarn
ENTRYPOINT [ "yarn", "run", "start:dev"  ]
