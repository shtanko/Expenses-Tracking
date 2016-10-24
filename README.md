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
git clone https://github.com/shtanko/Expenses-Tracking
cd qm_test_proj/
docker-compose up
```

But may to install all dependencies manually and run it as described below. 

### Technologies

Server side of this project uses Python 2.7 with Django 1.10 as main framework (main structure and ORM), Django REST Framework as addition framework (provides RESTful API) and MySQL as database.
Client side uses JS and ReactJS framework to handle and render most of all UI.

### Dependencies

So. To run this server you have to install
* Python 2.7 
* MySQL 5.5.52 or higher
* Django 1.10 or higher
* Django REST Framework 3.4.* or higher

### Installation

Install Python (with pip and virtualenv) and MySQL by yourself.
After that create some folder that will contain server-side code and libraries, go to this directory and download this repository. 
Then just run this:

```sh
#!/bin/bash

virtualenv venv
venv/bin/pip install django
venv/bin/pip install MySQL-python
venv/bin/pip install djangorestframework
```

### Database set up

```sh
python manage.py dbshell < clear_db.sql
python manage.py dbshell < db_dump.sql
```

## API Reference

### Applications

Project has two django-applications: 
* **users** - manage user behaviour
* **expenses** - manage expense behaviour

### Running server

Go to /your/project/folder/ and run that:

```
python manage.py runserver
```

TODO: Add more completed API Reference! 

## Running tests

### Setting up the database

To run tests to have to prepare your database, because to run test django creates their own database with name **test_** and uses it. So, first of all you have to grant to user, that is used by django (this was created above) all privileges to database with that name:

```
GRANT ALL PRIVILEGES ON 'test_'.* TO 'username'@'localhost';
```

### Running tests

Go to /your/project/folder/ and to test **users** application run that:

```
python manage.py test users
```

To test **expenses** application run this:

```
python manage.py test expenses
```

## Contributors

...

## License

...