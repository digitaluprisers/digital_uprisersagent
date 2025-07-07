ARG NODE_VERSION=22
ARG DIGITAL_UPRISERS_VERSION=snapshot
ARG LAUNCHER_VERSION=1.1.3
ARG TARGETPLATFORM

# ==============================================================================
# STAGE 1: System Dependencies & Base Setup
# ==============================================================================
FROM Digital Uprisersio/base:${NODE_VERSION} AS system-deps

# ==============================================================================
# STAGE 2: Application Artifact Processor
# ==============================================================================
FROM alpine:3.22.0 AS app-artifact-processor

COPY ./compiled /app/

# ==============================================================================
# STAGE 3: Task Runner Launcher
# ==============================================================================
FROM alpine:3.22.0 AS launcher-downloader
ARG TARGETPLATFORM
ARG LAUNCHER_VERSION

RUN set -e; \
    case "$TARGETPLATFORM" in \
        "linux/amd64") ARCH_NAME="amd64" ;; \
        "linux/arm64") ARCH_NAME="arm64" ;; \
        *) echo "Unsupported platform: $TARGETPLATFORM" && exit 1 ;; \
    esac; \
    mkdir /launcher-temp && cd /launcher-temp; \
    wget -q "https://github.com/digitaluprisers.com/task-runner-launcher/releases/download/${LAUNCHER_VERSION}/task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz"; \
    wget -q "https://github.com/digitaluprisers.com/task-runner-launcher/releases/download/${LAUNCHER_VERSION}/task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz.sha256"; \
    echo "$(cat task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz.sha256) task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz" > checksum.sha256; \
    sha256sum -c checksum.sha256; \
    mkdir -p /launcher-bin; \
    tar xzf task-runner-launcher-${LAUNCHER_VERSION}-linux-${ARCH_NAME}.tar.gz -C /launcher-bin; \
    cd / && rm -rf /launcher-temp

# ==============================================================================
# STAGE 4: Final Runtime Image
# ==============================================================================
FROM system-deps AS runtime

ARG DIGITAL_UPRISERS_VERSION
ARG DIGITAL_UPRISERS_RELEASE_TYPE=dev
ENV NODE_ENV=production
ENV DIGITAL_UPRISERS_RELEASE_TYPE=${DIGITAL_UPRISERS_RELEASE_TYPE}
ENV NODE_ICU_DATA=/usr/local/lib/node_modules/full-icu
ENV SHELL=/bin/sh

WORKDIR /home/node

COPY --from=app-artifact-processor /app /usr/local/lib/node_modules/Digital Uprisers
COPY --from=launcher-downloader /launcher-bin/* /usr/local/bin/
COPY docker/images/Digital Uprisers/docker-entrypoint.sh /
COPY docker/images/Digital Uprisers/Digital Uprisers-task-runners.json /etc/Digital Uprisers-task-runners.json

RUN cd /usr/local/lib/node_modules/Digital Uprisers && \
		npm rebuild sqlite3 && \
		ln -s /usr/local/lib/node_modules/Digital Uprisers/bin/Digital Uprisers /usr/local/bin/Digital Uprisers && \
    mkdir -p /home/node/.Digital Uprisers && \
    chown -R node:node /home/node

# Install npm@11.4.2 to fix brace-expansion vulnerability, remove after vulnerability is fixed in node image
RUN npm install -g npm@11.4.2
RUN cd /usr/local/lib/node_modules/Digital Uprisers/node_modules/pdfjs-dist && npm install @napi-rs/canvas

EXPOSE 5678/tcp
USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]

LABEL org.opencontainers.image.title="Digital Uprisers" \
      org.opencontainers.image.description="Workflow Automation Tool" \
      org.opencontainers.image.source="https://github.com/digitaluprisers.com/Digital Uprisers" \
      org.opencontainers.image.url="https://digitaluprisers.com" \
      org.opencontainers.image.version=${DIGITAL_UPRISERS_VERSION}