FROM ghost:3-alpine
MAINTAINER Matthew Gall <docker@matthewgall.com>

WORKDIR /var/lib/ghost/content

RUN apk add --update \
	git \
	&& rm -rf /var/cache/apk/ \
	&& mkdir -p adapters/storage/b2 \
	&& cd content/adapters/b2 \
	&& git clone git@github.com:martiendt/ghost-storage-adapter-b2.git . \
	&& npm install

COPY content/images images
COPY content/themes themes