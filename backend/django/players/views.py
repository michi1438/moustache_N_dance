from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .utils import send_otp
from datetime import datetime
import pyotp
# from django.contrib.auth.models import User
from django.middleware.csrf import get_token

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
# from .models import Player
from .serializers import *

User = get_user_model()

# @api_view(['GET', 'POST'])
# def getPlayers(request):

#     if request.method == 'GET':
#         players = Player.objects.all()
#         serializer = PlayerSerializer(players, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = PlayerSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

# @api_view(['GET', 'PUT', 'DELETE'])
# def getPlayer(request, id):
#     try:
#         player = Player.objects.get(pk=id)
#     except Player.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)

#     if request.method == 'GET':
#         serializer = PlayerSerializer(player)
#         return Response(serializer.data)

#     elif request.method == 'PUT':
#         serializer = PlayerSerializer(player, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     elif request.method == 'DELETE':
#         player.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

class login_view(APIView):
	permission_classes = [AllowAny]

	def post(self, request , *args, **kwargs):
		try:
			user = authenticate(
				request,
				username=request.data['username'],
				password=request.data['password'],
			)
			if user is not None:
				# if user.is_2fa_verified:
				# 	# Si 2FA est activé, ne pas connecter l'utilisateur immédiatement
				# 	return Response(
				# 		{
				# 			'message': '2FA is enabled. Please provide OTP.',
				# 			'require_2fa': True,
				# 			'user_id': user.id
				# 		},
				# 		status=status.HTTP_200_OK
				# 	)
				# else:
					# Si 2FA n'est pas activé, connecter l'utilisateur normalement
					login(request, user)
					csrf_token = get_token(request)
					print("csrf_token : ", csrf_token)
					return Response(
						{
							'data': UserSerializer(user).data,
							'crsfToken': csrf_token,
							'message': 'User logged in successfully',
						},
						status=status.HTTP_200_OK
					)
			raise ValueError('Invalid credentials')
		except Exception as e:
			return Response(
				{'message': f"{type(e).__name__}: {str(e)}"},
				status=status.HTTP_401_UNAUTHORIZED
			)

# def login_view(request):
#     if request.method == "POST":
#         username = request.POST["username"]
#         password = request.POST["password"]
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             send_otp(request)
#             request.session['username'] = username
#             return redirect('otp')
#         else:
#             messages.success(request, ("OUAICH T'ES QUI TOI !?"))
#             return redirect('login')

#     else:
#         return render(request, 'auth/login.html', {})

class register_view(APIView):
	permission_classes = [AllowAny]

	def post(self, request, *args, **kwargs):
		email = request.data.get('email')
		username= request.data.get('username')
		
		if User.objects.filter(email=email).exists():
			return Response(
				{'email': 'Email already exists'},
				status=status.HTTP_400_BAD_REQUEST
			)

		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(
				{
					'data': serializer.data,
					'message': 'User registered successfully'
				},
				status=status.HTTP_201_CREATED
			)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def otp_view(request):
    if request.method == "POST":
        otp = request.POST['otp']
        username = request.session['username']

        otp_secret_key = request.session['otp_secret_key']
        otp_valid_date = request.session['otp_valid_date']

        if otp_secret_key and otp_valid_date is not None:
            valid_date = datetime.fromisoformat(otp_valid_date)

            if valid_date > datetime.now():
                totp = pyotp.TOTP(otp_secret_key, interval=60)

                if totp.verify(otp):
                    user = get_object_or_404(User, username=username)
                    login(request, user)

                    del request.session['otp_secret_key']
                    del request.session['otp_valid_date']

                    return redirect('home')
                else:
                    messages.success(request, ("invalid otp code!"))
            else:
                messages.success(request, ("otp code has expired!"))
        else:
            messages.success(request, ("something went wrong, retry later..."))

    return render(request, 'auth/otp.html', {}) 

class logout_view(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, *args, **kwargs):
		try:
			logout(request)
			return Response(
				{'message': 'User logged out successfully'},
				status=status.HTTP_200_OK
			)
		except Exception as e:
			return Response(
				{'message': f"{type(e).__name__}: {str(e)}"},
				status=status.HTTP_400_BAD_REQUEST
			)

# def logout_view(request):
#     logout(request)
#     messages.success(request, ("DECONNEXION REUSSIE ! GG !"))
#     return redirect('login')

# def register_view(request):
#     if request.method == "POST":
#         form = UserCreationForm(request.POST)
#         if form.is_valid():
#             form.save()
#             username = form.cleaned_data['username']
#             password = form.cleaned_data['password1']
#             user = authenticate(username=username, password=password)
#             login(request, user)
#             messages.success(request, ("Registration successful!"))
#             return redirect('home')
#     else:
#         form = UserCreationForm()
#     return render(request, 'auth/register.html', {
#         'form':form,
#         })
