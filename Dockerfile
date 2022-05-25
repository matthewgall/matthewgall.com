FROM klakegg/hugo:0.91.2-onbuild AS hugo

FROM nginx:alpine

ADD nginx.template /etc/nginx/conf.d/default.template
COPY --from=hugo /target /usr/share/nginx/html

CMD sh -c "envsubst \"`env | awk -F = '{printf \" \\\\$%s\", $1}'`\" < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"