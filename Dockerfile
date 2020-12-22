FROM node:12 AS builder
WORKDIR /app
COPY package.json /app/
RUN npm install --unsafe-perm

COPY . /app
RUN npm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
