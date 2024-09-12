from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
# from .utils import send_otp
from django.contrib.auth import authenticate
from datetime import datetime
from django.utils import timezone
import pyotp
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
import requests
import os 
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers 

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import *
from .serializers import *

@api_view(['GET', 'POST'])
def getPlayers(request):

    if request.method == 'GET':
        players = Player.objects.all()
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PlayerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

# LISTER LES JOUEURS
@api_view(['GET'])
def list_players(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

# CREER UN JOUEUR
@api_view(['POST'])
@permission_classes([AllowAny])
def create_player(request):
    serializer = PlayerSerializer(data=request.data)
    if serializer.is_valid():
        player = Player(**serializer.validated_data)
        player.set_password(serializer.validated_data['password'])
        player.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# LISTER LES DETAILS, MODIFIER LES INFOS, SUPPRIMER UN JOUEUR (accessible par le joueur lui-meme uniquement)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def player_details(request):

    player = request.user

    if request.method == 'GET':
        serializer = PlayerSerializer(player)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PlayerSerializer(player, data=request.data, partial=True)
        if serializer.is_valid():
            if 'password' in serializer.validated_data:
                player.set_password(serializer.validated_data['password'])
                serializer.validated_data['password'] = player.password
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if player.otp:
            player.otp.delete()
        player.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# class login_view(APIView):
# 	permission_classes = [AllowAny]

# 	def post(self, request , *args, **kwargs):
# 		try:
# 			user = authenticate(
# 				request,
# 				username=request.data['username'],
# 				password=request.data['password'],
# 			)
# 			if user is not None:
# 				# if user.is_2fa_verified:
# 				# 	# Si 2FA est activé, ne pas connecter l'utilisateur immédiatement
# 				# 	return Response(
# 				# 		{
# 				# 			'message': '2FA is enabled. Please provide OTP.',
# 				# 			'require_2fa': True,
# 				# 			'user_id': user.id
# 				# 		},
# 				# 		status=status.HTTP_200_OK
# 				# 	)
# 				# else:
# 					# Si 2FA n'est pas activé, connecter l'utilisateur normalement
# 					login(request, user)
# 					csrf_token = get_token(request)
# 					print("csrf_token : ", csrf_token)
# 					return Response(data=PlayerSerializer(user).data, status=status.HTTP_200_OK)
# 			raise ValueError('Invalid credentials')
# 		except Exception as e:
# 			return Response(
# 				{'message': f"{type(e).__name__}: {str(e)}"},
# 				status=status.HTTP_401_UNAUTHORIZED
# 			)

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

# class register_view(APIView):
# 	permission_classes = [AllowAny]

# 	def post(self, request, *args, **kwargs):
# 		email = request.data.get('email')
# 		username= request.data.get('username')
		
# 		if User.objects.filter(email=email).exists():
# 			return Response(
# 				{'email': 'Email already exists'},
# 				status=status.HTTP_400_BAD_REQUEST
# 			)

# 		serializer = PlayerSerializer(data=request.data)
# 		if serializer.is_valid():
# 			serializer.save()
# 			return Response(
# 				{
# 					'data': serializer.data,
# 					'message': 'User registered successfully'
# 				},
# 				status=status.HTTP_201_CREATED
# 			)
# 		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def authorize_fortytwo(request):

    try:
        urls = 'https://api.intra.42.fr/oauth/token'
        x = requests.post(urls, data={'grant_type': 'authorization_code', 'client_id': os.environ.get("ID_API"), 'client_secret': os.environ.get("SECRET_API"), 'code': request.data, 'redirect_uri': 'https://localhost:8443/callback/'})
        token = x.json()['access_token']

        urls = 'https://api.intra.42.fr/v2/me'
        x = requests.get(urls, headers={'Authorization': 'Bearer ' + token})
        player, created = Player.objects.get_or_create(
            username = x.json()['login'] + "_42",
            first_name = x.json()['first_name'],
            last_name = x.json()['last_name'],
            email = x.json()['email']
            #avatar = x.json()['image'],
            #player.token42 = x.json()['token'],
        )
        #print (x.json())
        player.save()

        refresh = RefreshToken.for_user(player)
        return Response({"username": str(player.username),
            "email": str(player.email),
            "first_name": str(player.first_name),
            "last_name": str(player.last_name),
            "refresh": str(refresh),
            "access": str(refresh.access_token)
                         #"token42": str(player.token)
            }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'42_login error': f"{type(e).__name__}: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )



#    serializer = PlayerSerializer(data=request.data)
#        player = Player(**serializer.validated_data)
#        player.set_password(serializer.validated_data['password'])
#        player.save()
#        return Response(serializer.data, status=status.HTTP_201_CREATED)




# def otp_view(request):
#     if request.method == "POST":
#         otp = request.POST['otp']
#         username = request.session['username']

#         otp_secret_key = request.session['otp_secret_key']
#         otp_valid_date = request.session['otp_valid_date']

#         if otp_secret_key and otp_valid_date is not None:
#             valid_date = datetime.fromisoformat(otp_valid_date)

#             if valid_date > datetime.now():
#                 totp = pyotp.TOTP(otp_secret_key, interval=60)

#                 if totp.verify(otp):
#                     user = get_object_or_404(User, username=username)
#                     login(request, user)

#                     del request.session['otp_secret_key']
#                     del request.session['otp_valid_date']

#                     return redirect('home')
#                 else:
#                     messages.success(request, ("invalid otp code!"))
#             else:
#                 messages.success(request, ("otp code has expired!"))
#         else:
#             messages.success(request, ("something went wrong, retry later..."))

#     return render(request, 'auth/otp.html', {}) 

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
        # return Response({"message": "Player deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# LOGIN (debut d'authentification et envoi de l'OTP)
@api_view(['POST'])
def login_view(request):
    username = request.data['username']
    password = request.data['password']
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    player = authenticate(request, username=username, password=password)
    if player is not None:
        login(request, player) #to remove
        # csrf_token = get_token(request)
        # print("csrf_token : ", csrf_token)
        # return Response(data=PlayerSerializer(player).data, status=status.HTTP_200_OK)
        player.send_otp()
        return Response({"message": "OTP sent to user",
            "id": str(player.id)
            }, status=status.HTTP_202_ACCEPTED)

    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# VERIFICATION DE L'OTP (authentification avec JWT Token si OTP valide)
@api_view(['POST'])
def verify_otp(request):
    player_id = request.data['id']
    otp = request.data['otp']

    if not otp or not player_id:
        return Response({"error": "OTP and player ID are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        player = Player.objects.get(id=player_id)
    except Player.DoesNotExist:
        return Response({"error": f'Player with id {player_id} does not exist'},status=status.HTTP_404_NOT_FOUND)

    if player.otp is None:
        return Response({"error": f'No OTP generated for user {player.username}'}, status=status.HTTP_400_BAD_REQUEST)

    if player.otp.verify_otp(otp):
        player.online = True
        player.save()
        # return Response(data=PlayerSerializer(player).data, status=status.HTTP_200_OK)

        refresh = RefreshToken.for_user(player)
        return Response({"message": "OTP is valid",
            "username": str(player.username),
            "nickname": str(player.nickname),
            "email": str(player.email),
            # "avatar": player.avatar,
            "refresh": str(refresh),
            "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid OTP or OTP expired"}, status=status.HTTP_401_UNAUTHORIZED)

# # LOGOUT (blacklist du token)
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def logout(request):
#     try:
#         refresh_token = request.data['refresh']

#         if not refresh_token:
#             return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

#         token = RefreshToken(refresh_token)
#         token.blacklist()

#         player = request.user
#         player.online = False
#         player.save()

#         return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)

#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# # LISTER SES AMIS
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def list_friends(request):
#     player = request.user
#     friends = player.friends.all()
#     serializer = FriendSerializer(friends, many=True)
#     return Response(serializer.data)

# # DEMANDE D'AMI
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def friend_request(request):
#     to_player_id = request.data['to_player_id']
#     from_player = request.user

#     try:
#         to_player = Player.objects.get(id=to_player_id)
#     except Player.DoesNotExist:
#         return Response({"error": f'Player with id {id} does not exist'},status=status.HTTP_404_NOT_FOUND)

#     # si la demande inverse existe deja, accepter la demande directement et ne pas en recreer une
#     if FriendRequest.objects.filter(from_player=to_player, to_player=from_player).exists():
#         existing_request = FriendRequest.objects.get(from_player=to_player, to_player=from_player) 
#         existing_request.delete()
#         from_player.friends.add(to_player)
#         return Response({"message": "Friend request accepted automatically because reciprocal"}, status=status.HTTP_200_OK)

#     # si la meme demande existe deja, renvoyer une erreur
#     if FriendRequest.objects.filter(from_player=from_player, to_player=to_player).exists():
#         return Response({"error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)

#     friend_request = FriendRequest(from_player=from_player, to_player=to_player)
#     friend_request.save()
#     return Response({"message": "Friend request sent"}, status=status.HTTP_201_CREATED)

# # REPONSE A UNE DEMANDE D'AMI
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def friend_response(request):
#     requester_id = request.data['requester_id'] # id du demandeur
#     action = request.data['action'] # accept ou reject
#     player = request.user

#     try:
#         requester = Player.objects.get(id=requester_id)
#     except Player.DoesNotExist:
#         return Response({"error": f'Player with id {requester_id} does not exist'},status=status.HTTP_404_NOT_FOUND)

#     try:
#         friend_request = FriendRequest.objects.get(from_player=requester, to_player=player)

#         if action == "accept":
#             friend_request.delete()
#             requester.friends.add(player)
#             return Response({"message": "Friend request accepted"}, status=status.HTTP_200_OK)

#         elif action == "reject":
#             friend_request.delete()
#             return Response({"message": "Friend request rejected"}, status=status.HTTP_200_OK)

#         return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

#     except FriendRequest.DoesNotExist:
#         return Response({"error": f'No friend request found between player {requester_id} and player {player.id}'},status=status.HTTP_404_NOT_FOUND)

# # SUPPRESSION D'UN AMI
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def friend_delete(request):
#     friend_id = request.data['friend_id']
#     player = request.user

#     try:
#         friend = Player.objects.get(id=friend_id)

#         if friend in player.friends.all():
#             player.friends.remove(friend)
#             return Response({"message": "Friend removed successfully"}, status=status.HTTP_200_OK)
#         return Response({"error": f'Player with id {friend_id} is not your friend'}, status=status.HTTP_400_BAD_REQUEST)
        
#     except Player.DoesNotExist:
#         return Response({"error": f'Player with id {friend_id} does not exist'},status=status.HTTP_404_NOT_FOUND)
