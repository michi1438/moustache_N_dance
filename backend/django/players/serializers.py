from rest_framework import serializers
from .models import Player

class Player42Serializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        exclude = ["password"]

class PlayerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Player
		fields = '__all__'

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username', 'nickname', 'online']
