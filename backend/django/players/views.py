from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages

from .utils import send_otp
from datetime import datetime
import pyotp
from django.contrib.auth.models import User


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            send_otp(request)
            request.session['username'] = username
            return redirect('otp')
        else:
            messages.success(request, ("OUAICH T'ES QUI TOI !?"))
            return redirect('login')

    else:
        return render(request, 'auth/login.html', {})

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
