
echo "DJANGO_INIT.SH"

wait-for-it -h postgres -p 5432 -t 30
sleep 3 

django-admin startproject mysite

cd mysite/

mv /mysite2/* mysite/

echo -n "pwd = "
pwd

python3 manage.py startapp players
python3 manage.py startapp pong

mv /players ./players
mv /pong ./pong

echo "Create migrations"
python3 manage.py makemigrations
python3 manage.py makemigrations players
echo "============================"

echo "Migrate"
python3 manage.py migrate
echo "============================"

echo "Create Super User"
python3 manage.py createsuperuser --email=admin@admin.com --noinput
echo "============================"

echo "Start server"
python3 manage.py runserver 0.0.0.0:8000
