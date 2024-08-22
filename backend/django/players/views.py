from django.contrib.auth.models import User #a supprimer
from django.shortcuts import render, redirect, get_object_or_404 #a supprimer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm #a supprimer
from django.contrib import messages #a supprimer
from datetime import datetime
import pyotp

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Player
from .serializers import PlayerSerializer
from .utils import send_otp


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

@api_view(['GET', 'PUT', 'DELETE'])
def getPlayer(request, id):
    try:
        player = Player.objects.get(pk=id)
    except Player.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

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
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def login_view(request):
    username = request.data['username']
    password = request.data['password']
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

    player = authenticate(request, username=username, password=password)
    if player is not None:
        refresh = RefreshToken.for_user(player)

        send_otp(request, player)

        return Response({
            "message": "OTP sent to user",
            "refresh": str(refresh),
            "token": str(refresh.access_token)
            }, status=status.HTTP_202_ACCEPTED)

    return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def verify_otp(request):
    if request.method == "POST":
        otp = request.data['otp']
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

def logout_view(request):
    logout(request)
    messages.success(request, ("DECONNEXION REUSSIE ! GG !"))
    return redirect('login')

def register_view(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data['username']
            password = form.cleaned_data['password1']
            user = authenticate(username=username, password=password)
            login(request, user)
            messages.success(request, ("Registration successful!"))
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'auth/register.html', {
        'form':form,
        })
