from django.contrib import admin
from .models import User

class MyAdminSite(admin.AdminSite):
    site_header = "Monty Python administration"


admin_site = MyAdminSite(name="myadmin")

admin.site.register(User)
