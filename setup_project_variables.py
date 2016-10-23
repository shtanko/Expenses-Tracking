from users.models import User
from django.contrib.auth.models import Group, Permission


def create_groups():
    print 'creating user groups...'
    regular_users = Group.objects.create(name='regular_users')
    # Users from that group are regular users, that able to CRUD only on their
    # owned records.

    user_managers = Group.objects.create(name='manager_users')
    # Users from that group are manager users, that able to CRUD users.

    admin_users = Group.objects.create(name='admin_users')
    # Users from that group are admin users, that able to CRUD all records and
    # users.

    crud_users = list(
        Permission.objects.filter(codename__endswith='user')
    )
    crud_expenses = list(
        Permission.objects.filter(codename__endswith='expense')
    )
    crud_permissions = list(
        Permission.objects.filter(codename__endswith='permission')
    )

    regular_users.permissions.set(crud_expenses)
    print '"regular_users" group was created'
    user_managers.permissions.set(crud_users)
    print '"user_managers" group was created'
    admin_users.permissions.set(crud_users + crud_expenses + crud_permissions)
    print '"admin_users" group was created'


def create_root_user():
    root_raw_password = 'root'
    root = User.objects.create_user(
        username='root',
        password=root_raw_password,
        email='root@mail.com',
        first_name='Root',
        last_name='Root'
    )
    admins = Group.objects.get(name='admin_users')
    root.groups.set([admins])
    root.save()
    print 'admin user "{0}" with password "{1}" was created'.format(
        root.username, root_raw_password
    )
