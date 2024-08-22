import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail

def send_otp(request, player):
    totp = pyotp.TOTP(pyotp.random_base32(), interval=60)
    otp = totp.now()
    request.session['otp_secret_key'] = totp.secret
    valid_date = datetime.now() + timedelta(minutes=1)
    request.session['otp_valid_date'] = str(valid_date)

    player.otp = otp
    player.save()

    print(otp)

    send_mail(
        subject = "Here is your OTP for Moustache N Dance !",
        message = f'Votre code OTP est {otp}',
        from_email = None,
        recipient_list = [player.email],
        fail_silently = False
        )
