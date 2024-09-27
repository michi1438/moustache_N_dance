from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
	path('api-auth/', include('rest_framework.urls')),
    path('api/players/', include('players.urls'), name='players'),
    path('api/tournaments/', include('tournaments.urls'), name='tournaments'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
