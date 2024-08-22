from django.urls import path
from . import views

urlpatterns = [
        path('login', views.login_view, name="login"),
        path('verify-otp', views.verify_otp, name="otp"),
        path('logout', views.logout_view, name="logout"),
        path('register', views.register_view, name="register"),
        path('', views.getPlayers),
        path('details/<int:id>', views.getPlayer),
]
