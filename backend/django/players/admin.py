from django.contrib import admin
from .models import Player, OTPManager, FriendRequest

admin.site.register(Player)
admin.site.register(OTPManager)
admin.site.register(FriendRequest)
