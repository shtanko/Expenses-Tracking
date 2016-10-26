# Expenses Tracking

This project aims to be a simple web-site where users can create an account and store the information about their daily expenses.
This web-site stores tree types of users: 
* **regular user** - can store and edit self expenses;
* **managers** - can create/read/update/delete user information (but not their expenses);
* **admin** - can CRUD as user information as user's expenses.
In addition, this web-side is an attempt to use RESTful API.

## Installing

This project supports **docker-compose**. So easiest way to deploy it is to [install **docker-compose**](https://docs.docker.com/compose/install/) and 

```sh
cd /path/to/project/root/
git clone https://github.com/shtanko/Expenses-Tracking some_directory_name
cd some_directory_name/
docker-compose up
```

But you may want to install all dependencies manually and run it as described below. 

### Technologies

Server side of this project uses Python 2.7 with Django 1.10 as main framework (main structure and ORM), Django REST Framework as addition framework (provides RESTful API) and MySQL as database.
Client side uses JS and ReactJS framework to handle and render most of all UI. ReactJS classes compiles JSX scripts on NodeJS.

### Dependencies

So. To run this server you have to install
* Python 2.7 
* MySQL 5.5.52 or higher
* Django 1.10 or higher
* Django REST Framework 3.4.* or higher
* NodeJS 4.5.0 or higher

### Installation

Install Python (with pip and virtualenv) and MySQL by yourself.
After that create some folder that will contain server-side code and libraries, go to this directory and download this repository. Then:

```sh
cd /path/to/project/root/
git clone https://github.com/shtanko/Expenses-Tracking some_directory_name
virtualenv venv
source venv/bin/activate
venv/bin/pip install -r requirements.txt
```

### Database set up

```sh
python manage.py dbshell < clear_db.sql
python manage.py dbshell < set_user_perm_for_testing.sql
python manage.py dbshell < db_dump.sql
```

## API Reference

### Applications

Project has two django-applications: 
* **users** - manage user behaviour
* **expenses** - manage expense behaviour

### Running server

Go to /your/project/folder/ and run `python manage.py runserver`

### Running tests

Go to /your/project/folder/ and to test **users** application run `python manage.py test users`

To test **expenses** application run `python manage.py test expenses`
