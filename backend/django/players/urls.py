from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
        path('create', views.create_player),
        path('list', views.list_players),
        path('details/<int:id>', views.player_details),
        path('login', views.login, name="login"),
        path('logout', views.logout, name="logout"),
        path('token_refresh', TokenRefreshView.as_view(), name="token_refresh"),
        path('verify_otp', views.verify_otp, name="otp"),
]
