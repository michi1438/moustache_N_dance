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

from .models import Player
from .serializers import PlayerSerializer

@api_view(['GET'])
def list_players(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_player(request):
    serializer = PlayerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def player_details(request, id):
    try:
        player = Player.objects.get(pk=id)
    except Player.DoesNotExist:
        return Response({"error": f'Player with id {id} does not exist'},status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PlayerSerializer(player)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PlayerSerializer(player, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        player.delete()
        return Response({"message": f'Player with id {id} deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def login(request):
    username = request.data['username']
    password = request.data['password']
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    player = authenticate(request, username=username, password=password)
    if player is not None:
        refresh = RefreshToken.for_user(player)

        player.send_otp()

        return Response({
            "message": f'OTP {player.otp.otp_code} sent to user',
            "refresh": str(refresh),
            "access": str(refresh.access_token)
            }, status=status.HTTP_202_ACCEPTED)

    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_otp(request):
    otp = request.data['otp']

    if not otp:
        return Response({"error": "OTP is required"}, status=status.HTTP_400_BAD_REQUEST)

    player = request.user

    if player.otp is None:
        return Response({"error": f'No OTP generated for user {player.username}'}, status=status.HTTP_400_BAD_REQUEST)

    if player.otp.verify_otp(otp):
        player.online = True
        player.save()
        return Response({"message": "OTP is valid"}, status=status.HTTP_200_OK)

    return Response({"error": "Invalid OTP or OTP expired"}, status=status.HTTP_401_UNAUTHORIZED)

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
