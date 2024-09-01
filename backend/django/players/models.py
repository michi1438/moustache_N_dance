from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from django.conf import settings
import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail

class Tournament(models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tournaments_created', on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tournaments_participated', blank=True) 
    results = models.JSONField(blank=True, null=True)

    SIZE_CHOICES = [
            (4, '4 Players'),
            (8, '8 Players'),
            (16, '16 Players'),
            ]
    tournament_size = models.IntegerField(default=0, choices=SIZE_CHOICES)

    STATUS_CHOICES = [
            ('upcoming', 'Upcoming'),
            ('ongoing', 'Ongoing'),
            ('completed', 'Completed'),
            ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='upcoming') 

    def __str__(self):
        return f'Tournament created by {self.created_by}'

class FriendRequest(models.Model):
    from_player = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_requests', on_delete=models.CASCADE)
    to_player = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_requests', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('from_player', 'to_player')

    def __str__(self):
        return f'{self.from_player} -> {self.to_player}'

class OTPManager(models.Model):
    otp_code = models.IntegerField(null=True, blank=True)
    otp_secret_key = models.CharField(max_length=255, null=True, blank=True)
    otp_valid_date = models.DateTimeField(null=True, blank=True)

    def generate_otp(self):
        totp = pyotp.TOTP(pyotp.random_base32(), interval=60)
        self.otp_code = totp.now()
        self.otp_secret_key = totp.secret
        self.otp_valid_date = datetime.now() + timedelta(minutes=1)
        self.save()

    def verify_otp(self, otp):
        if datetime.now() > self.otp_valid_date:
            return False
        totp = pyotp.TOTP(self.otp_secret_key, interval=60)
        return totp.verify(otp)

    def __str__(self):
        return f'OTPManager for {self.id}'

class Player(AbstractUser):
    nickname = models.CharField(unique=True, max_length=50, null=True, blank=True)
    email = models.EmailField(unique=True, blank=False, null=False)
    avatar = models.ImageField(upload_to='', null=True, blank=True)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)

    otp = models.OneToOneField(OTPManager, on_delete=models.CASCADE, null=True, blank=True)
    online = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)

    def send_otp(self):
        if not self.otp:
            self.otp = OTPManager.objects.create()
            self.save()

        self.otp.generate_otp()
        print(self.otp.otp_code)
        send_mail(
            subject = "Here is your OTP for Moustache N Dance !",
            message = f'Salut {self.username} aka "{self.nickname}", ton code OTP est {self.otp.otp_code}',
            from_email = None,
            recipient_list = [self.email],
            fail_silently = False
            )

    def __str__(self):
        return self.username
