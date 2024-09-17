from django.contrib.auth import authenticate
from datetime import datetime
from django.utils import timezone
import pyotp

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Player, FriendRequest
from .serializers import PlayerSerializer, FriendSerializer

# LISTER LES JOUEURS
@api_view(['GET'])
def list_players(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# CREER UN JOUEUR
@api_view(['POST'])
def create_player(request):
    serializer = PlayerSerializer(data=request.data)
    if serializer.is_valid():
        player = Player(**serializer.validated_data)
        player.set_password(serializer.validated_data['password'])
        player.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# LISTER LES DETAILS, MODIFIER LES INFOS, SUPPRIMER UN JOUEUR (accessible par le joueur lui-meme uniquement)
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def player_details(request):

    player = request.user

    if request.method == 'GET':
        serializer = PlayerSerializer(player)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = PlayerSerializer(player, data=request.data, partial=True)
        if serializer.is_valid():
            if 'password' in serializer.validated_data:
                player.set_password(serializer.validated_data['password'])
                serializer.validated_data['password'] = player.password
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        serializer = PlayerSerializer(player, data=request.data, partial=True)
        if serializer.is_valid():
            if 'wins' in serializer.validated_data:
                player.wins += serializer.validated_data['wins']
            if 'losses' in serializer.validated_data:
                player.losses += serializer.validated_data['losses']
            if 'history' in serializer.validated_data:
                if not isinstance(serializer.validated_data['history'], list):
                    return Response({"error": "History should be a list entry"}, status=status.HTTP_400_BAD_REQUEST)
                player.history += serializer.validated_data['history']
            else:
                return Response({"error": "Invalid field"}, status=status.HTTP_400_BAD_REQUEST)
            player.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if player.otp:
            player.otp.delete()
        player.delete()
        return Response({"message": "Player deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# LOGIN (debut d'authentification et envoi de l'OTP)
@api_view(['POST'])
def login(request):
    username = request.data['username']
    password = request.data['password']
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    player = authenticate(request, username=username, password=password)
    if player is not None:
        player.send_otp()
        return Response({"message": "OTP sent to user",
            "player_id": str(player.id)
            }, status=status.HTTP_202_ACCEPTED)

    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# VERIFICATION DE L'OTP (authentification avec JWT Token si OTP valide)
@api_view(['POST'])
def verify_otp(request):
    player_id = request.data['player_id']
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

        refresh = RefreshToken.for_user(player)
        return Response({"message": "OTP is valid",
            "refresh": str(refresh),
            "access": str(refresh.access_token)
            }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid OTP or OTP expired"}, status=status.HTTP_401_UNAUTHORIZED)

# LOGOUT (blacklist du token)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data['refresh']

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()

        player = request.user
        player.online = False
        player.save()

        return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# LISTER SES AMIS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_friends(request):
    player = request.user
    friends = player.friends.all()
    serializer = FriendSerializer(friends, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# LISTER SES DEMANDES D'AMI RECUES
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requests_received(request):
    player = request.user

    friend_requests_received = FriendRequest.objects.filter(to_player=player)
    sender_usernames = friend_requests_received.values_list('from_player_username', flat=True)

    return Response({"sender_usernames": list(sender_usernames)}, status=status.HTTP_200_OK)

# LISTER SES DEMANDES D'AMI ENVOYEES
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requests_sent(request):
    player = request.user

    friend_requests_sent = FriendRequest.objects.filter(from_player=player)
    receiver_usernames = friend_requests_sent.values_list('to_player_username', flat=True)

    return Response({"receiver_usernames": list(receiver_usernames)}, status=status.HTTP_200_OK)

# DEMANDE D'AMI
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def friend_request(request):
    to_player_username = request.data['to_player_username']
    from_player = request.user

    try:
        to_player = Player.objects.get(username=to_player_username)
    except Player.DoesNotExist:
        return Response({"error": f'Player with id {id} does not exist'},status=status.HTTP_404_NOT_FOUND)

    # si la demande inverse existe deja, accepter la demande directement et ne pas en recreer une
    if FriendRequest.objects.filter(from_player=to_player, to_player=from_player).exists():
        existing_request = FriendRequest.objects.get(from_player=to_player, to_player=from_player) 
        existing_request.delete()
        from_player.friends.add(to_player)
        return Response({"message": "Friend request accepted automatically because reciprocal"}, status=status.HTTP_200_OK)

    # si la meme demande existe deja, renvoyer une erreur
    if FriendRequest.objects.filter(from_player=from_player, to_player=to_player).exists():
        return Response({"error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)

    friend_request = FriendRequest(from_player=from_player, to_player=to_player)
    friend_request.save()
    return Response({"message": "Friend request sent"}, status=status.HTTP_201_CREATED)

# REPONSE A UNE DEMANDE D'AMI
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def friend_response(request):
    requester_username = request.data['requester_username'] # id du demandeur
    action = request.data['action'] # accept ou reject
    player = request.user

    try:
        requester = Player.objects.get(username=requester_username)
    except Player.DoesNotExist:
        return Response({"error": f'Player with id {requester_id} does not exist'},status=status.HTTP_404_NOT_FOUND)

    try:
        friend_request = FriendRequest.objects.get(from_player=requester, to_player=player)

        if action == "accept":
            friend_request.delete()
            requester.friends.add(player)
            return Response({"message": "Friend request accepted"}, status=status.HTTP_200_OK)

        elif action == "reject":
            friend_request.delete()
            return Response({"message": "Friend request rejected"}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

    except FriendRequest.DoesNotExist:
        return Response({"error": f'No friend request found between player {requester_id} and player {player.id}'},status=status.HTTP_404_NOT_FOUND)

# SUPPRESSION D'UN AMI
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def friend_delete(request):
    friend_username = request.data['friend_username']
    player = request.user

    try:
        friend = Player.objects.get(username=friend_username)

        if friend in player.friends.all():
            player.friends.remove(friend)
            return Response({"message": "Friend removed successfully"}, status=status.HTTP_200_OK)
        return Response({"error": f'Player with id {friend_id} is not your friend'}, status=status.HTTP_400_BAD_REQUEST)
        
    except Player.DoesNotExist:
        return Response({"error": f'Player with id {friend_id} does not exist'},status=status.HTTP_404_NOT_FOUND)

