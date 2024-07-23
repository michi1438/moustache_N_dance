#!/bin/bash

sleep 10

echo "Create migrations"
python3 manage.py makemigrations
echo "============================"

echo "Migrate"
python3 manage.py migrate
echo "============================"

echo "Create Super User"
python3 manage.py createsuperuser --email=admin@admin.com --noinput
echo "============================"

echo "Start server"
python3 manage.py runserver 0.0.0.0:8000
