ARG CADDY_VERSION

FROM dhi.io/golang:1-dev AS build

RUN CGO_ENABLED=0 go install github.com/caddyserver/xcaddy/cmd/xcaddy@latest

ARG CADDY_VERSION
WORKDIR /build
RUN xcaddy build v${CADDY_VERSION} --with github.com/caddy-dns/cloudflare

FROM dhi.io/caddy:${CADDY_VERSION}
COPY --from=build /build/caddy /usr/local/bin/caddy
