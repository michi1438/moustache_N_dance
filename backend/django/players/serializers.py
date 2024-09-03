from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, get_user_model
from .models import Player
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth.hashers import check_password

User = get_user_model()

# class UserSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = Player
# 		fields = ['id', 'username', 'email', 'password', 'avatar']

# 	def create(self, validated_data):
# 		username = validated_data.get('username')
# 		email = validated_data.get('email')
# 		password = validated_data.get('password')
# 		# avatar = validated_data.get('avatar')

# 		prohibited_usernames = ["guest", "system", "admin"]

# 		if not username:
# 			raise serializers.ValidationError({'username': 'Username is required.'})
# 		else:
# 			if username.lower() in prohibited_usernames:
# 				raise serializers.ValidationError({'username': 'Username not allowed'})
# 			elif len(username) > 8:
# 				raise serializers.ValidationError({'username': 'Max length is 8'})

# 		if not email:
# 			raise serializers.ValidationError({'email': 'Email is required.'})
			
# 		try:
# 			validate_email(email)
# 		except DjangoValidationError:
# 			raise serializers.ValidationError({'email': 'Enter a valid email address.'})

# 		if not password:
# 			raise serializers.ValidationError({'password': 'Password is required.'})
# 		try:
# 			validate_password(password)
# 		except DjangoValidationError as e:
# 			raise serializers.ValidationError({'password': list(e.messages)})

# 		user = User.objects.create_user(
# 			username=username,
# 			email=email,
# 			# avatar=avatar
# 		)
# 		user.save()
# 		return user

	# def update(self, instance, validated_data):

	# 	prohibited_usernames = ["guest", "system", "admin"]
	# 	username = validated_data.get('username')
	# 	if username:
	# 		if User.objects.filter(username=username).exclude(id=instance.id).exists():
	# 			raise serializers.ValidationError({'username': 'This username is already in use.'})
	# 		elif username == instance.username:
	# 			raise serializers.ValidationError({'username': 'This is already your username.'})
	# 		elif len(username) > 8:
	# 			raise serializers.ValidationError({'username': 'Max length is 8'})
	# 		elif username.lower() in prohibited_usernames:
	# 			raise serializers.ValidationError({'username': 'Username not allowed'})

	# 		instance.username = username

	# 	email = validated_data.get('email')
	# 	if email:
	# 		if User.objects.filter(email=email).exclude(id=instance.id).exists():
	# 			raise serializers.ValidationError({'email': 'This email is already in use.'})
	# 		elif email == instance.email:
	# 			raise serializers.ValidationError({'email': 'This is already your email.'})
	# 		instance.email = email

	# 	password = validated_data.get('password')
	# 	if password:
	# 		if check_password(password, instance.password):
	# 			raise serializers.ValidationError({'password': 'This is already your password.'})
	# 		try:
	# 			validate_password(password)
	# 		except DjangoValidationError as e:
	# 			raise serializers.ValidationError({'password': list(e.messages)})
	# 		instance.set_password(password)

	# 	avatar = validated_data.get('avatar')
	# 	if avatar and avatar != instance.avatar:
	# 		instance.avatar.delete(save=False)
	# 		instance.avatar = avatar

	# 	instance.save()
	# 	return instance
class Player42Serializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        exclude = ["password"]

class PlayerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Player
		fields = '__all__'

	# def create(self, validated_data):
	# 	username = validated_data.get('username')
	# 	email = validated_data.get('email')
	# 	password = validated_data.get('password')
	# 	nickname = validated_data.get('nickname')
	# 	# avatar = validated_data.get('avatar')

	# 	prohibited_usernames = ["guest", "system", "admin"]

	# 	if not username:
	# 		raise serializers.ValidationError({'username': 'Username is required.'})
	# 	else:
	# 		if username.lower() in prohibited_usernames:
	# 			raise serializers.ValidationError({'username': 'Username not allowed'})
	# 		elif len(username) > 8:
	# 			raise serializers.ValidationError({'username': 'Max length is 8'})

	# 	if not email:
	# 		raise serializers.ValidationError({'email': 'Email is required.'})
			
	# 	try:
	# 		validate_email(email)
	# 	except DjangoValidationError:
	# 		raise serializers.ValidationError({'email': 'Enter a valid email address.'})

	# 	if not password:
	# 		raise serializers.ValidationError({'password': 'Password is required.'})
	# 	try:
	# 		validate_password(password)
	# 	except DjangoValidationError as e:
	# 		raise serializers.ValidationError({'password': list(e.messages)})

	# 	user = User.objects.create_user(
	# 		username=username,
	# 		email=email,
	# 		nickname=nickname,
	# 		# avatar=avatar
	# 	)
	# 	user.set_password(password)
	# 	user.save()
	# 	return user

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username', 'nickname', 'online']
