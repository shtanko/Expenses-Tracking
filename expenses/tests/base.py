from django.contrib.auth.models import Group
from rest_framework.test import APIClient

from users.models import User
from expenses.models import Expense


def get_expense_ids_from_user(user):
    res = Expense.objects.filter(
        owner__id=user.id
    ).values_list('id', flat=True).order_by('id')
    res = map(int, res)
    return set(res)


def get_expense_ids_from_response(response):
    res = []
    for line in response.data:
        res.append(line.get('id'))
    res.sort()
    return set(res)


class CreateDataMethodsForTestCase(object):
    """
    Methods for creating data for setUpTestData method.
    """
    @classmethod
    def create_user_groups(cls):
        from users.create_groups import create_groups
        create_groups()

        cls.admins_group = Group.objects.get(name='admin_users')
        cls.managers_group = Group.objects.get(name='manager_users')
        cls.regular_users_group = Group.objects.get(name='regular_users')

    @classmethod
    def create_user_clients(cls):
        cls.admin_user_raw_password = 'root'
        cls.manager_user_raw_password = 'manager'
        cls.regular_user_raw_password = 'regular'

        cls.admin_user = User.objects.create_user(
            username='root',
            password=cls.admin_user_raw_password,
            email='root@email.com',
            first_name='Iosiff',
            last_name='Stalihn'
        )
        cls.manager_user = User.objects.create_user(
            username='manager',
            password=cls.manager_user_raw_password,
            email='manager@email.com',
            first_name='Steve',
            last_name='Jobs'
        )
        cls.regular_user = User.objects.create_user(
            username='regular',
            password=cls.regular_user_raw_password,
            email='regular_user@email.com',
            first_name='Vasiliy',
            last_name='Puphkin'
        )

        cls.admin_user.groups.set([cls.admins_group])
        cls.manager_user.groups.set([cls.managers_group])
        cls.regular_user.groups.set([cls.regular_users_group])

        cls.main_users = [cls.admin_user, cls.manager_user, cls.regular_user]

        cls.admin_client = APIClient()
        cls.manager_client = APIClient()
        cls.regular_user_client = APIClient()

    @classmethod
    def login_user_clients(cls):
        cls.admin_client.login(
            username=cls.admin_user.username,
            password=cls.admin_user_raw_password
        )
        cls.manager_client.login(
            username=cls.manager_user.username,
            password=cls.manager_user_raw_password
        )
        cls.regular_user_client.login(
            username=cls.regular_user.username,
            password=cls.regular_user_raw_password
        )

    @classmethod
    def create_more_users(cls):
        cls.another_admin_user = User.objects.create_user(
            username='another_root',
            password='another_' + cls.admin_user_raw_password,
            email='another_root@email.com',
            first_name='another_Iosiff',
            last_name='another_Stalihn'
        )
        cls.another_manager_user = User.objects.create_user(
            username='another_manager',
            password='another_' + cls.manager_user_raw_password,
            email='another_manager@email.com',
            first_name='another_Steve',
            last_name='another_Jobs'
        )
        cls.another_regular_user = User.objects.create_user(
            username='another_regular',
            password='another_' + cls.regular_user_raw_password,
            email='another_regular_user@email.com',
            first_name='another_Vasiliy',
            last_name='another_Puphkin'
        )

        cls.another_admin_user.groups.set([cls.admins_group])
        cls.another_manager_user.groups.set([cls.managers_group])
        cls.another_regular_user.groups.set([cls.regular_users_group])

        cls.another_users = [
            cls.another_admin_user,
            cls.another_manager_user,
            cls.another_regular_user,
        ]

    @classmethod
    def create_expenses(cls, userlist=None, number=0):
        if not userlist:
            return
        item_base_name = 'item_name'
        item_base_descr = 'Item base description.'
        item_base_value = 5.55
        for user in userlist:
            for i in xrange(number):
                exp_item = Expense.objects.create(
                    name=item_base_name + str(i),
                    descr=item_base_descr + ' Item owner:' + user.username,
                    value=item_base_value + i,
                    owner=user
                )
                exp_item.save()
