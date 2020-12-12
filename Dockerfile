FROM ghost:3.34.1-alpine
MAINTAINER Matthew Gall <docker@matthewgall.com>

RUN apk add --update \
	git \
	&& rm -rf /var/cache/apk/ \
	&& mkdir -p /var/lib/ghost/content/adapters/storage \
	&& cd /var/lib/ghost/content/adapters/storage \
	&& git clone https://github.com/bluemeda/ghost-storage-adapter-b2.git b2 \
	&& cd b2 \
	&& npm install

COPY content/images /var/lib/ghost/content/images
COPY content/themes /var/lib/ghost/content/themes
