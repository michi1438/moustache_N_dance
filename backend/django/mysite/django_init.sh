
echo "DJANGO_INIT.SH"

wait-for-it -h postgres -p 5432 -t 40
sleep 3 

echo "Create migrations==========="
python3 manage.py makemigrations
python3 manage.py makemigrations players
echo "============================"

echo "Create staticfiles==========="
python3 manage.py collectstatic --noinput
mkdir -p staticfiles/avatars
echo "============================"

echo "Migrate====================="
python3 manage.py migrate
echo "============================"

echo "Create Super User==========="
python3 manage.py createsuperuser --email=admin@admin.com --noinput
echo "============================"

echo "Start WSGI-gunicorn"
gunicorn --preload --proxy-protocol --certfile="/cert.pem" --keyfile="/cert.key" mysite.wsgi:application -b 0.0.0.0:8000


#echo "Start server"
#python3 manage.py runserver 0.0.0.0:8001
