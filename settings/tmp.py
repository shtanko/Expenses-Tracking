from settings.base import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS': {
            'read_default_file': os.path.join(BASE_DIR, 'mysql_db_tmp.cnf'),
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
