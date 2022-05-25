FROM klakegg/hugo:0.91.2-onbuild AS hugo
COPY . /src

FROM nginx:alpine
COPY --from=hugo /target /usr/share/nginx/html
ADD nginx.template /etc/nginx/conf.d/default.template
CMD sh -c "envsubst \"`env | awk -F = '{printf \" \\\\$%s\", $1}'`\" < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"