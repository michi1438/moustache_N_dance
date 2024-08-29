from django.urls import path
from . import views

urlpatterns = [
        path('create', views.create_tournament),
        path('list', views.list_tournaments),
        path('<int:tournament_id>', views.tournament_details),
]
