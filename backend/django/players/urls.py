from django.urls import path, include
from .views import *
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
        # path('login', login_view.as_view(), name="login"),
        # path('otp', views.otp_view, name="otp"),
        path('logout', logout_view.as_view(), name="logout"),
        # path('register', register_view.as_view(), name="register"),
        # path('', views.getPlayers),
        # path('details/<int:id>', views.getPlayer),
        
		path('register', views.create_player),
        path('list', views.list_players),
        path('details', views.player_details),
        path('login', views.login_view, name="login"),
        path('authorize_fortytwo/', views.authorize_fortytwo, name="authorize_fortytwo"),
        # path('logout', views.logout, name="logout"),
        # path('token_refresh', TokenRefreshView.as_view(), name="token_refresh"),
        path('verify_otp', views.verify_otp, name="otp"),
        # path('friends/list', views.list_friends),
        # path('friends/request', views.friend_request),
        # path('friends/response', views.friend_response),
        # path('friends/delete', views.friend_delete),
]
