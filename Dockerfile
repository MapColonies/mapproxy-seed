# syntax=docker/dockerfile:1
FROM ghcr.io/mapproxy/mapproxy/mapproxy:1.16.0

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1    

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=docker/requirements.txt,target=docker/requirements.txt \
    # install uwsgi dependencies
    apt update && \
    apt -y install --no-install-recommends gcc && \
    # install mapproxy dependencies
    python -m pip install -r docker/requirements.txt && \
    pip cache purge && \
    apt-get -y update && \
    apt-get install -y \
    gettext  

RUN apt-get update && \
 apt-get install -y \
    nodejs npm

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

WORKDIR /mapproxy


RUN mkdir -p ./settings ./cache_data && \
    chgrp -R 0 ./ && \
    chmod -R g=u+w ./

# Patch mapproxy source code.
ARG PATCH_FILES=true
RUN --mount=type=bind,source=docker/patch/redis.py,target=redis.py \
    if [ "${PATCH_FILES}" = true ]; then \
        cp redis.py /usr/local/lib/python3.10/site-packages/mapproxy/cache/redis.py; \
    fi

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install
COPY . .
RUN npm run build
RUN cp -r dist/* ./

# Creating user to simulate openshift.
RUN useradd -ms /bin/bash user && usermod -a -G root user
USER user

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
ENTRYPOINT ["bash", "-c", "docker/scripts/docker-entrypoint.sh"]
