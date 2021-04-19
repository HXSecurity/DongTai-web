FROM nginx
COPY ./dist /usr/share/nginx/html/
COPY ./nginx.conf.example /etc/nginx/nginx.conf

EXPOSE 80
