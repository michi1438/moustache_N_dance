"""

MYSITE URLS

"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('pong.urls')),
    path('admin/', admin.site.urls, name='admin'),
    path('api/players/', include('players.urls'), name='players'),
    path('api/players/', include('django.contrib.auth.urls')),
]
