#!/bin/bash
set -e
DOMAIN=$1
if [[ -z "$DOMAIN" ]]; then
  echo "Please give the domain as the first parameter"
  exit 1
fi

if [[ "$2" == "delete" ]]; then
  certutil -delstore -user "My" $DOMAIN
  certutil -delstore -user "Root" issuer-$DOMAIN
  exit 0
fi

export MSYS_NO_PATHCONV=1
ROOT_CRT="$DOMAIN-root.crt"
ROOT_KEY="$DOMAIN-root.key"
openssl req -x509 -new -nodes -out $ROOT_CRT \
  -newkey rsa:2048 -keyout $ROOT_KEY \
  -days 100 \
  -subj "/C=NL/L=Amsterdam/emailAddress=nikolaos@issuer-$DOMAIN/CN=issuer-$DOMAIN/"
certutil -addstore -user "Root" $ROOT_CRT
ACME_CSR="$DOMAIN.csr"
ACME_KEY="$DOMAIN.key"
ACME_CRT="$DOMAIN.crt"
ACME_V3_EXT="$DOMAIN.v3.ext"
tee $ACME_V3_EXT <<-HERE >/dev/null
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = $DOMAIN
HERE

openssl req -new -nodes -out $ACME_CSR \
  -newkey rsa:2048 -keyout $ACME_KEY \
  -subj "/C=NL/L=Amsterdam/emailAddress=nikolaos@$DOMAIN/CN=$DOMAIN/"
openssl x509 -req -in $ACME_CSR \
  -CA $ROOT_CRT -CAkey $ROOT_KEY -CAcreateserial \
  -out $ACME_CRT -days 100 -extfile $ACME_V3_EXT
certutil -addstore -user "My" $ACME_CRT