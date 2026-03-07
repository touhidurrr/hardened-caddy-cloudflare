# Hardened Caddy Cloudflare
Docker Hardened Caddy Image with Caddy Cloudflare Module

## Usage
```
docker pull touhidurrr/hardened-caddy-cloudflare
```

Then follow this guide: https://hub.docker.com/hardened-images/catalog/dhi/caddy/guides

## Docker Compose
```yml
services:
  caddy:
    image: touhidurrr/hardened-caddy-cloudflare
    container_name: hardened-caddy-cloudflare
    restart: always
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./caddy/Caddyfile:/etc/caddy/Caddyfile:ro
      - ./caddy/data:/data/caddy
      - ./caddy/config:/config/caddy
      # (Optional) in case you are using Unix domain sockets like me
      - ./sockets:/sockets
    environment:
      CF_API_TOKEN: <Your API Token>
```
