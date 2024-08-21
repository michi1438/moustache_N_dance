import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail

def send_otp(request):
    totp = pyotp.TOTP(pyotp.random_base32(), interval=60)
    otp = totp.now()
    request.session['otp_secret_key'] = totp.secret
    valid_date = datetime.now() + timedelta(minutes=1)
    request.session['otp_valid_date'] = str(valid_date)

    print(otp)
    email_target = ["laurent.zito@gmail.com"]

    send_mail(
        subject = "Here is your OTP for Moustach N Dance !",
        message = otp,
        from_email = None,
        recipient_list = email_target,
        fail_silently = False
        )
