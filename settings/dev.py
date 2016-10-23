from settings.base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'qm_test_proj',
        'USER': 'qmtestprojuser',
        'PASSWORD': 'c0w9mutw49ct',
        'HOST': 'db',
        'PORT': '5432',
    }
}