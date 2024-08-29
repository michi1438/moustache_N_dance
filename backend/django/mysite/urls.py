from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('pong.urls')),
    path('admin/', admin.site.urls, name='admin'),
    #path('players/', include('django.contrib.auth.urls')),
    path('players/', include('players.urls'), name='players'),
    path('tournaments/', include('tournaments.urls'), name='tournaments'),
]
