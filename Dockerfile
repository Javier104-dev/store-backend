FROM public.ecr.aws/docker/library/node:22.12.0-alpine

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add \
    python3 \
    make \
    g++ \
    curl

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
