from django.contrib import admin
from .models import Administrator, AppUser
# Register your models here.

admin.site.register(Administrator)
admin.site.register(AppUser)