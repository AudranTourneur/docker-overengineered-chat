FROM alpine:3.18.5
RUN apk add --update --no-progress --no-cache nginx

#We well ensure that errors and access go to standard error/ouput

RUN ln -sf /dev/stdout /var/log/nginx/access.log

RUN ln -sf /dev/stderr /var/log/nginx/error.log

ENV APPLICATION_PORT_FRONT 3000

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD nginx -g 'pid /run/nginx.pid; daemon off;'
