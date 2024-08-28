from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from django.conf import settings
import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail


# class User(models.Model):
#     """A typical class defining a model, derived from the Model class."""

#     # Fields
#     username = models.CharField(max_length=20, help_text='Enter Username', primary_key=True)
#     password = models.CharField(max_length=20, help_text='Enter Password')
#     email = models.CharField(max_length=40, help_text='Enter Email')
#     # …

#     # Metadata
#     class Meta:
#         ordering = ['username']

#     # Methods

#     def set_password(self, raw_password):
#         self.password = make_password(raw_password)

#     def get_absolute_url(self):
#         """Returns the URL to access a particular instance of MyModelName."""
#         return reverse('model-detail-view', args=[str(self.id)])

#     def __str__(self):
#         """String for representing the MyModelName object (in Admin site etc.)."""
#         return self.username

# class Player(AbstractUser):
# 	avatar = models.ImageField(upload_to='', blank=True, null=True, default='')
# 	nickname = models.CharField(max_length=50)
#     # …

#     # Metadata
# 	class Meta:
# 		ordering = ['username']
# 		db_table = 'players'

# 		# Methods

# 	def set_password(self, raw_password):
# 		self.password = make_password(raw_password)

# 	def get_absolute_url(self):
# 		"""Returns the URL to access a particular instance of MyModelName."""
# 		return reverse('model-detail-view', args=[str(self.id)])

# 	def __str__(self):
# 		"""String for representing the MyModelName object (in Admin site etc.)."""
# 		return self.username


# class Player(models.Model):
#     username = models.CharField(max_length=50)
#     nickname = models.CharField(max_length=50)
#     password1 = models.CharField(max_length=50)
#     password2 = models.CharField(max_length=50)
#     email = models.EmailField(max_length=50)
#     #avatar = models.ImageField()

#     def __str__(self):
#         return self.username

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
