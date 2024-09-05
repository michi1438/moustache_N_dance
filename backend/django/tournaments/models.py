from django.db import models
from django.conf import settings

class Tournament(models.Model):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='tournaments_creation', on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tournaments_participation', blank=True) 
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
        return f'Tournament created by {self.created_by.username}'
