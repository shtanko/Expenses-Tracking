from django.contrib.auth.models import Group, Permission


def create_groups():
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
    user_managers.permissions.set(crud_users)
    admin_users.permissions.set(crud_users + crud_expenses + crud_permissions)
