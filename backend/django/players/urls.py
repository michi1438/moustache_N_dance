from django.urls import path
from .views import *
from . import views

urlpatterns = [
        path('login', login_view.as_view(), name="login"),
        path('otp', views.otp_view, name="otp"),
        path('logout', logout_view.as_view(), name="logout"),
        path('register', register_view.as_view(), name="register"),
        path('', views.getPlayers),
        path('details/<int:id>', views.getPlayer),
]
