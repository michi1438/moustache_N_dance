python manage.py makemigrations
python manage.py migrate
DJANGO_SUPERUSER_USERNAME=root DJANGO_SUPERUSER_PASSWORD=toor \
    python manage.py createsuperuser --email=admin@admin.com --noinput
python manage.py runserver 0.0.0.0:8000
