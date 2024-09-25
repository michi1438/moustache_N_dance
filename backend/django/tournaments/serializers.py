from rest_framework import serializers
from players.serializers import PlayerSerializer
from .models import Tournament

class TournamentSerializer(serializers.ModelSerializer):
    created_by = PlayerSerializer(read_only=True)
    participants = PlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['id', 'created_on', 'created_by', 'participants']
