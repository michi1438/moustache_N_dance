from django.contrib.auth.models import AbstractUser
from django.db import models

class Player(AbstractUser):
    nickname = models.CharField(max_length=50)
    email = models.EmailField(unique=True, blank=False, null=False)
    otp = models.IntegerField(null=True, blank=True)

    #avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

    def __str__(self):
        return self.username
