FROM dhi.io/caddy:${CADDY_VERSION}-debian13-dev AS build
RUN xcaddy build --with github.com/caddy-dns/cloudflare

FROM dhi.io/caddy:${CADDY_VERSION}
COPY --from=build /usr/bin/caddy /usr/bin/caddy
