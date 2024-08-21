from django.urls import include, path
from . import views
from oauth2_provider import urls as oauth2_urls

urlpatterns = [
        path('ologin/', include(oauth2_urls)),
        path('login', views.login_view, name="login"),
        path('otp', views.otp_view, name="otp"),
        path('logout', views.logout_view, name="logout"),
        path('register', views.register_view, name="register"),
        path('', views.getPlayers),
        path('details/<int:id>', views.getPlayer),
]
