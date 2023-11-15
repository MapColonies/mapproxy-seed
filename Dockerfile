FROM node:20 as build

WORKDIR /tmp/buildApp

COPY ./package*.json ./

RUN npm install
COPY . .
RUN npm run build
RUN npx pkg -t node16-linux ./package.json

FROM ghcr.io/mapproxy/mapproxy/mapproxy:1.16.0

# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=docker/requirements.txt,target=docker/requirements.txt \
    # install mapproxy dependencies
    python -m pip install -r docker/requirements.txt


RUN mkdir -p ./settings ./cache_data && \
    chgrp -R 0 ./ && \
    chmod -R g=u+w ./

# Patch mapproxy source code.
ARG PATCH_FILES=true
RUN --mount=type=bind,source=docker/patch/redis.py,target=redis.py \
    if [ "${PATCH_FILES}" = true ]; then \
        cp redis.py /usr/local/lib/python3.10/site-packages/mapproxy/cache/redis.py; \
    fi

COPY --from=build /tmp/buildApp/mapproxy-seed-cli /usr/bin/mapproxy-seed-cli

# Run the application.
ENTRYPOINT ["mapproxy-seed-cli"]
