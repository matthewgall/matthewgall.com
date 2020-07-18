FROM ghost:3-alpine
MAINTAINER Matthew Gall <docker@matthewgall.com>

COPY content/images /var/lib/ghost/content/images
COPY content/themes /var/lib/ghost/content/themes