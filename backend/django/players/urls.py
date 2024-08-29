from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
        path('create', views.create_player),
        path('list', views.list_players),
        path('details', views.player_details),
        path('login', views.login, name="login"),
        path('logout', views.logout, name="logout"),
        path('token_refresh', TokenRefreshView.as_view(), name="token_refresh"),
        path('verify_otp', views.verify_otp, name="otp"),
        path('friends/list', views.list_friends),
        path('friends/request', views.friend_request),
        path('friends/response', views.friend_response),
        path('friends/delete', views.friend_delete),
        path('tournament/create', views.create_tournament),
        path('tournament/list', views.list_tournaments),
        path('tournament/<int:tournament_id>', views.tournament_details),
]
