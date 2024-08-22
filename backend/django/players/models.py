from django.db import models
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser


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

class Player(AbstractUser):
	avatar = models.ImageField(upload_to='', blank=True, null=True, default='')
	nickname = models.CharField(max_length=50)
    # …

    # Metadata
	class Meta:
		ordering = ['username']
		db_table = 'players'

		# Methods

	def set_password(self, raw_password):
		self.password = make_password(raw_password)

	def get_absolute_url(self):
		"""Returns the URL to access a particular instance of MyModelName."""
		return reverse('model-detail-view', args=[str(self.id)])

	def __str__(self):
		"""String for representing the MyModelName object (in Admin site etc.)."""
		return self.username


# class Player(models.Model):
#     username = models.CharField(max_length=50)
#     nickname = models.CharField(max_length=50)
#     password1 = models.CharField(max_length=50)
#     password2 = models.CharField(max_length=50)
#     email = models.EmailField(max_length=50)
#     #avatar = models.ImageField()

#     def __str__(self):
#         return self.username