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

# class RegisterSerializer(serializers.ModelSerializer):
# 	username = serializers.CharField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
# 	email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
# 	password = serializers.CharField(required=True, write_only=True, validators=[validate_password])

# 	def create(self, validated_data):
# 		user = User.objects.create_user(
# 			username=validated_data['username'],
# 			email=validated_data['email'],
# 			password=validated_data['password']
# 		)
# 		player = Player.objects.create(owner=user, nickname=validated_data['username'])
# 		return user

# 	class Meta:
# 		model = User
# 		fields = ('id', 'username', 'email', 'password')