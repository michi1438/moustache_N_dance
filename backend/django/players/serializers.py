from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Player

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class LoginSerializer(serializers.Serializer):
	username = serializers.CharField(label="username")
	password = serializers.CharField(label="password")

	def validate(self, attrs):
		user = authenticate(request=self.context.get('request'),username=attrs['username'],password=attrs['password'])

		if not user:
			raise serializers.ValidationError("Incorrect Credentials")
		else:
			attrs['user'] = user
			return attrs