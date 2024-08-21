from django.db import models

class Player(models.Model):
    username = models.CharField(max_length=50)
#    nickname = models.CharField(max_length=50)
#    password1 = models.CharField(max_length=50)
#    password2 = models.CharField(max_length=50)
#    email = models.EmailField(max_length=50)
    #avatar = models.ImageField()

    def __str__(self):
        return self.username
