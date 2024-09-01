import os                                                                                                                                                                                                                  
from pathlib import Path                                                                                                                                                                                          
from datetime import timedelta
                                                                                                                                                                                                                  
# Build paths inside the project like this: BASE_DIR / 'subdir'.                                                                                                                                                  
BASE_DIR = Path(__file__).resolve().parent.parent                                                                                                                                                                 
                                                                                                                                                                                                                  
# Quick-start development settings - unsuitable for production                                                                                                                                                    
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/                                                                                                                                           
                                                                                                                                                                                                                  
# SECURITY WARNING: keep the secret key used in production secret!                                                                                                                                                
SECRET_KEY = os.environ.get('DJ_SECRETKEY')                                                                                                                                 
                                                                                                                                                                                                                  
# SECURITY WARNING: don't run with debug turned on in production!                                                                                                                                                 
DEBUG = True
                                                                                                                                                                                                                  
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS").split(" ")

ALLOWED_HOSTS_HTTPS = ["https://localhost", f"https://" + os.environ.get("DJANGO_ALLOWED_HOSTS"),
                        f"https://" + os.environ.get("DJANGO_ALLOWED_HOSTS") + ":10443"]
ALLOWED_HOSTS_HTTP = ["http://localhost", f"http://" + os.environ.get("DJANGO_ALLOWED_HOSTS"),
                        f"http://" + os.environ.get("DJANGO_ALLOWED_HOSTS") + ":10443"]

CSRF_TRUSTED_ORIGINS = ALLOWED_HOSTS_HTTPS + ALLOWED_HOSTS_HTTP
CSRF_ALLOWED_ORIGINS = ALLOWED_HOSTS_HTTPS + ALLOWED_HOSTS_HTTP

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_DOMAIN = None

CORS_ALLOWED_ORIGINS = [ 
    "https://profile.intra.42.fr",
    ]

SITE_ID = 1                                                                                                                                                                                                                                                                                                                                                                                                                

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Application definition                                                                                                                                                                                          

INSTALLED_APPS = [                                                                                                                                                                                                
    'django.contrib.admin',                                                                                                                                                                                       
    'django.contrib.auth',                                                                                                                                                                                        
    'django.contrib.contenttypes',                                                                                                                                                                                
    'django.contrib.sessions',                                                                                                                                                                                    
    'django.contrib.messages',                                                                                                                                                                                    
    'django.contrib.staticfiles',                                                                                                                                                                                 
    'django_bootstrap5',
    'mysite',
    'players',
    'tournaments',
    'rest_framework',
    'oauth2_provider',
    'corsheaders',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
]                                                                                                                                                                                                                 

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.ScryptPasswordHasher",
]
REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework_simplejwt.authentication.JWTAuthentication',
            ),
        }

SIMPLE_JWT = {
        'ACCESS_TOKEN_LIFETIME' : timedelta(minutes=5),
        'REFRESH_TOKEN_LIFETIME' : timedelta(days=1),
        'ROTATE_REFRESH_TOKENS' : True,
        'BLACKLIST_AFTER_ROTATION' : True,
        }

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'debug.log',
            'maxBytes': 1024*1024*15, # 15MB
            'backupCount': 10,
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
                                                                                                                                                                                                                  
MIDDLEWARE = [                                                                                                                                                                                                    
    'django.middleware.security.SecurityMiddleware',                                                                                                                                                              
    'django.contrib.sessions.middleware.SessionMiddleware',                                                                                                                                                       
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',                                                                                                                                                                  
    'django.middleware.csrf.CsrfViewMiddleware',                                                                                                                                                                  
    'django.contrib.auth.middleware.AuthenticationMiddleware',                                                                                                                                                    
    'django.contrib.messages.middleware.MessageMiddleware',                                                                                                                                                       
    'django.middleware.clickjacking.XFrameOptionsMiddleware',                                                                                                                                                     
]                                                                                                                                                                                                                 
                                                                                                                                                                                                                  
ROOT_URLCONF = 'mysite.urls'                                                                                                                                                                                      
                                                                                                                                                                                                                  
TEMPLATES = [                                                                                                                                                                                                     
    {                                                                                                                                                                                                             
        'BACKEND': 'django.template.backends.django.DjangoTemplates',                                                                                                                                             
        'DIRS': [ BASE_DIR / 'mysite/templates' ],                                                                                                                                                                                               
        'APP_DIRS': True,                                                                                                                                                                                         
        'OPTIONS': {                                                                                                                                                                                              
            'context_processors': [                                                                                                                                                                               
                'django.template.context_processors.debug',                                                                                                                                                       
                'django.template.context_processors.request',                                                                                                                                                     
                'django.contrib.auth.context_processors.auth',                                                                                                                                                    
                'django.contrib.messages.context_processors.messages',                                                                                                                                            
            ],                                                                                                                                                                                                    
        },                                                                                                                                                                                                        
    },                                                                                                                                                                                                            
]                                                                                                                                                                                                                 

LOGIN_URL = '/players/login/'
                                                                                                                                                                                                                  
WSGI_APPLICATION = 'mysite.wsgi.application'                                                                                                                                                                      

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

# Database                                                                                                                                                                                                        
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases                                                                                                                                                   
                                                                                                                                                                                                                  
DATABASES = {                                                                                                                                                                                                     
    "default": {                                                                                                                                                                                                  
        "ENGINE": "django.db.backends.postgresql",                                                                                                                                                                
        "NAME": os.environ.get('POSTGRES_DB'),                                                                                                                                                                                       
        "USER": os.environ.get('POSTGRES_USER'),                                                                                                                                                                                      
        "PASSWORD": os.environ.get('POSTGRES_PASSWORD'),                                                                                                                                                                                 
        "HOST": os.environ.get('PG_HOST'),                                                                                                                                                                                        
        "PORT": os.environ.get('PG_PORT'),                                                                                                                                                                                           
        "OPTIONS": {
            'sslmode': 'require',
            'sslcert': '/cert.pem',
            'sslkey': '/cert.key',
            },
    }                                                                                                                                                                                                             
}                                                                                                                                                                                                                 
                                                                                                                                                                                                                  
# Password validation                                                                                                                                                                                             
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators                                                                                                                                    
                                                                                                                                                                                                                  
AUTH_PASSWORD_VALIDATORS = [                                                                                                                                                                                      
    {                                                                                                                                                                                                             
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',                                                                                                                       
    },                                                                                                                                                                                                            
    {                                                                                                                                                                                                             
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',                                                                                                                                 
    },                                                                                                                                                                                                            
    {                                                                                                                                                                                                             
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',                                                                                                                                
    },                                                                                                                                                                                                            
    {                                                                                                                                                                                                             
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',                                                                                                                               
    },                                                                                                                                                                                                            
]                                                                                                                                                                                                                 
                                                                                                                                                                                                                  
                                                                                                                                                                                                                  
# Internationalization                                                                                                                                                                                            
# https://docs.djangoproject.com/en/4.2/topics/i18n/                                                                                                                                                              
                                                                                                                                                                                                                  
LANGUAGE_CODE = 'en-us'                                                                                                                                                                                           
                                                                                                                                                                                                                  
TIME_ZONE = 'UTC'                                                                                                                                                                                                 
                                                                                                                                                                                                                  
USE_I18N = True                                                                                                                                                                                                   
                                                                                                                                                                                                                  
USE_TZ = False                                                                                                                                                                                                     
                                                                                                                                                                                                                  
                                                                                                                                                                                                                  
# Static files (CSS, JavaScript, Images)                                                                                                                                                                          
# https://docs.djangoproject.com/en/4.2/howto/static-files/                                                                                                                                                       
                                                                                                                                                                                                                  
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = 'static/'  
                                                                                                                                                                                                                  
# Default primary key field type                                                                                                                                                                                  
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field                                                                                                                                          

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = "MOUSTACHE N DANCE"
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

AUTH_USER_MODEL = 'players.Player'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
