"""

MYSITE URLS

"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', include('pong.urls')),
    path('admin/', admin.site.urls, name='admin'),
	path('api-auth/', include('rest_framework.urls')),
    path('api/players/', include('players.urls'), name='players'),
    path('api/players/', include('django.contrib.auth.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)