FROM debian:stable-slim

RUN apt-get update -y \
  && apt-get clean \
  && apt-get install bash curl unzip -y

RUN curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/usr/local sh -s v1.22.1 \
  && export DENO_INSTALL="/root/.local" \
  && export PATH="$DENO_INSTALL/bin:$PATH" \
  && deno install --unstable --allow-net --no-check --allow-env=PGDATABASE,PGHOST,PGPORT,PGUSER,PGPASSWORD,PGAPPNAME --allow-read=. --allow-write=nessie.config.ts,db --name nessie  https://deno.land/x/nessie@2.0.5/cli.ts

WORKDIR /var/www/src

# Copy over other src code
COPY src/. .

# Cache app.ts and deps file
RUN deno cache --unstable deps.ts
RUN deno cache --unstable app.ts
