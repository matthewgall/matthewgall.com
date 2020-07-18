FROM ghost:3-alpine
MAINTAINER Matthew Gall <docker@matthewgall.com>

RUN apk add --update \
	git \
	&& rm -rf /var/cache/apk/ \
	&& mkdir -p /var/lib/ghost/content/adapters/storage/b2 \
	&& cd /var/lib/ghost/content/adapters/storage/b2 \
	&& git clone git@github.com:martiendt/ghost-storage-adapter-b2.git . \
	&& npm install

COPY content/images /var/lib/ghost/content/images
COPY content/themes /var/lib/ghost/content/themes