from django.urls import path, include
from .views import *
from . import views
from oauth2_provider import urls as oauth2_urls
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
        path('ologin/', include(oauth2_urls)),
        # path('login', login_view.as_view(), name="login"),
        # path('otp', views.otp_view, name="otp"),
        # path('logout', logout_view.as_view(), name="logout"),
        # path('register', register_view.as_view(), name="register"),
        # path('', views.getPlayers),
        # path('details/<int:id>', views.getPlayer),
        
		path('register', views.create_player),
        path('list', views.list_players),
        path('details', views.player_details),
        path('login', views.login_view, name="login"),
        path('authorize_fortytwo/', views.authorize_fortytwo, name="authorize_fortytwo"),
        path('logout', views.logout, name="logout"),
        path('profile', views.player_details, name="profile"),
        # path('token_refresh', TokenRefreshView.as_view(), name="token_refresh"),
        path('verify_otp', views.verify_otp, name="otp"),
        path('friends/list', views.list_friends),
        path('friends/requests_received', views.requests_received),
        path('friends/requests_sent', views.requests_sent),
        path('friends/request', views.friend_request),
        path('friends/response', views.friend_response),
        path('friends/delete', views.friend_delete),
]
