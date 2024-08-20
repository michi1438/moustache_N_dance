from django.db import models
from django.urls import reverse
from django.contrib.auth.hashers import make_password


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


class Player(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    pseudo = models.CharField(max_length=50)

    def __str__(self):
        return self.first_name + ' ' + self.last_name

# class Player(models.Model):
# 	owner = models.OneToOneField('auth.User', related_name='Player', on_delete=models.CASCADE)
# 	nickname = models.CharField(max_length=20)
# 	avatar = models.ImageField(max_length=200, default="", upload_to='')

# 	# def set_offline_if_inactive(self, threshold):
# 	# 	if self.status == 'ONLINE' and (timezone.now() - self.last_activity).total_seconds() > threshold:
# 	# 		self.status = 'OFFLINE'
# 	# 		self.save()

# 	def __str__(self):
# 		return self.owner.username