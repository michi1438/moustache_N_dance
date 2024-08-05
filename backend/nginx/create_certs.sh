#!/bin/sh

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /cert.key -out /cert.pem << EOF
CH
VD
renens
moustache

mysite
admin@admin.fr
EOF

