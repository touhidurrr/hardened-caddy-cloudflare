FROM dhi.io/caddy:2-debian13-dev AS build
RUN xcaddy build --with github.com/caddy-dns/cloudflare

FROM dhi.io/caddy:2
COPY --from=build /usr/bin/caddy /usr/bin/caddy
