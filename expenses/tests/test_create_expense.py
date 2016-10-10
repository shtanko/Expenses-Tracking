from django.contrib.auth.models import Group
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from users.models import User
from expenses.models import Expense


class VisitorCreateExpenseTests(APITestCase):
    """
    Visitor can not create any Expense object because they have to be bounded
    to the user who created them.
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
        item_base_name = 'iten_name'
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

    @classmethod
    def setUpTestData(cls):
        cls.create_user_groups()
        cls.create_user_clients()
        cls.login_user_clients()
        cls.create_more_users()

        cls.user_count = User.objects.count()

        cls.default_item_number = 5
        cls.create_expenses(
            userlist=cls.main_users + cls.another_users,
            number=cls.default_item_number
        )

    def setUp(self):
        self.current_client = self.client

    def test_cr_exp_to_regular_user(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_regular_user.id,
        }
        response = self.current_client.post(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_cr_exp_to_manager(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_manager_user.id,
        }
        response = self.current_client.post(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_cr_exp_to_admin(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_admin_user.id,
        }
        response = self.current_client.post(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_cr_exp_to_self(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
        }
        response = self.current_client.post(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )


class RegularUserCreateExpenseTests(VisitorCreateExpenseTests):
    """
    Regular user can create only self expense items.
    """
    def setUp(self):
        self.current_client = self.regular_user_client
        self.current_user = self.regular_user

    def test_cr_exp_to_regular_user(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_regular_user.id,
        }
        response = self.current_client.post(url, data)
        # As a result regular user will create an instance
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # But that instance will be bounded to user from what request arrived.
        # Number of items of user to what we tried to create new expense item
        # have not to change from the default value.
        self.assertEqual(
            Expense.objects.filter(
                owner__id=self.another_regular_user.id
            ).count(),
            self.default_item_number
        )
        # And number of items of current user have to increase by one.
        self.assertEqual(
            Expense.objects.filter(owner__id=self.current_user.id).count(),
            self.default_item_number + 1
        )

    def test_cr_exp_to_manager(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_manager_user.id,
        }
        response = self.current_client.post(url, data)
        # As a result regular user will create an instance
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # But that instance will be bounded to user from what request arrived.
        # Number of items of user to what we tried to create new expense item
        # have not to change from the default value.
        self.assertEqual(
            Expense.objects.filter(
                owner__id=self.another_manager_user.id
            ).count(),
            self.default_item_number
        )
        # And number of items of current user have to increase by one.
        self.assertEqual(
            Expense.objects.filter(owner__id=self.current_user.id).count(),
            self.default_item_number + 1
        )

    def test_cr_exp_to_admin(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_admin_user.id,
        }
        response = self.current_client.post(url, data)
        # As a result regular user will create an instance
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # But that instance will be bounded to user from what request arrived.
        # Number of items of user to what we tried to create new expense item
        # have not to change from the default value.
        self.assertEqual(
            Expense.objects.filter(
                owner__id=self.another_admin_user.id
            ).count(),
            self.default_item_number
        )
        # And number of items of current user have to increase by one.
        self.assertEqual(
            Expense.objects.filter(owner__id=self.current_user.id).count(),
            self.default_item_number + 1
        )

    def test_cr_exp_to_self(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
        }
        response = self.current_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Expense.objects.filter(owner__id=self.current_user.id).count(),
            self.default_item_number + 1
        )


class ManagerCreateExpenseTests(RegularUserCreateExpenseTests):
    """
    Manager user can create only self expense items.
    """
    def setUp(self):
        self.current_client = self.manager_client
        self.current_user = self.manager_user


class AdminCreateExpenseTests(ManagerCreateExpenseTests):
    """
    Admin user can create any expense items to any user.
    """
    def setUp(self):
        self.current_client = self.admin_client
        self.current_user = self.admin_user

    def test_cr_exp_to_regular_user(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_regular_user.id,
        }
        response = self.current_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Expense.objects.filter(
                owner__id=self.another_regular_user.id
            ).count(),
            self.default_item_number + 1
        )

    def test_cr_exp_to_manager(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_manager_user.id,
        }
        response = self.current_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Expense.objects.filter(
                owner__id=self.another_manager_user.id
            ).count(),
            self.default_item_number + 1
        )

    def test_cr_exp_to_admin(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.another_admin_user.id,
        }
        response = self.current_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Expense.objects.filter(
                owner__id=self.another_admin_user.id
            ).count(),
            self.default_item_number + 1
        )

    def test_cr_exp_to_self(self):
        url = reverse('expenses:list_and_create')
        data = {
            'name': 'some_expense_name',
            'descr': 'Some expense description.',
            'value': 10,
            'owner': self.admin_user.id,
        }
        response = self.current_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Expense.objects.filter(owner__id=self.current_user.id).count(),
            self.default_item_number + 1
        )
