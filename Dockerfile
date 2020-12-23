FROM  registry-vpc.cn-beijing.aliyuncs.com/secnium/iast-ui-base:latest as builder
COPY . /app
RUN npm run build

FROM nginx
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
