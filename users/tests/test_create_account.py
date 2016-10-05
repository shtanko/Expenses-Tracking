from django.contrib.auth.models import Group
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from users.models import User


class VisitorCreateAccountTests(APITestCase):
    """
    This TestCate is created to test visitor permissions and restrictions
    to create user account.
    """
    def setUp(self):
        self.current_user = self.client

    @classmethod
    def setUpTestData(cls):
        from users.create_groups import create_groups
        create_groups()

        cls.admins_group = Group.objects.get(name='admin_users')
        cls.managers_group = Group.objects.get(name='manager_users')
        cls.regular_users_group = Group.objects.get(name='regular_users')

        admin_user = User.objects.create_user(
            username='root',
            password='root',
            email='root@email.com',
            first_name='Iosiff',
            last_name='Stalihn'
        )
        manager_user = User.objects.create_user(
            username='manager',
            password='manager',
            email='manager@email.com',
            first_name='Steve',
            last_name='Jobs'
        )
        regular_user = User.objects.create_user(
            username='regular',
            password='regular',
            email='regular_user@email.com',
            first_name='Vasiliy',
            last_name='Puphkin'
        )

        cls.user_count = User.objects.count()

        admin_user.groups.set([cls.admins_group])
        manager_user.groups.set([cls.managers_group])
        regular_user.groups.set([cls.regular_users_group])

        cls.admin_user = admin_user
        cls.manager_user = manager_user
        cls.regular_user = regular_user

        cls.admin_client = APIClient()
        cls.manager_client = APIClient()
        cls.regular_user_client = APIClient()

        cls.admin_client.login(username='root', password='root')
        cls.manager_client.login(username='manager', password='manager')
        cls.regular_user_client.login(username='regular', password='regular')

    def test_creates_regular_user_account(self):
        """
        Visitor can create a regular user account but credentials have to
        contains at least username and password.
        """

        # An account creation endpoint url.
        url = reverse('users:list_and_create')

        # User does not have to specify a user group flield. The defaul value
        # should be a regular_users_group.
        data = {
            'username': 'mary',
            'password': 'mary',
            # 'email': 'mary@email.com',
            # 'first_name': 'Mary',
            # 'last_name': 'Jane',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 1)
        self.assertEqual(
            response.data['groups'], [unicode(self.regular_users_group)]
        )

    def test_creates_full_regular_user_account(self):
        """
        Visitor can create a regular user account but credentials may to
        contains with username and password an email, user first_naem and user
        last_name.
        """
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
            'email': 'mary@email.com',
            'first_name': 'Mary',
            'last_name': 'Jane',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 1)
        self.assertEqual(
            response.data['groups'], [unicode(self.regular_users_group)]
        )

    def test_attemps_to_create_account_without_password(self):
        """
        Visitor have to pass at least username and password to create an
        account.
        """
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary'
        }
        response = self.current_user.post(url, data)
        self.assertEqual(
            response.data.get('password'),
            [u'This field is required.']
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_attemps_to_create_account_without_username(self):
        """
        Visitor have to pass at least username and password to create an
        account.
        """
        url = reverse('users:list_and_create')
        data = {
            'password': 'mary'
        }
        response = self.current_user.post(url, data)
        self.assertEqual(
            response.data.get('username'),
            [u'This field is required.']
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_attempt_to_create_an_admin_account(self):
        """
        Visitor can create only a regular user account.
        """
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
            'email': 'mary@email.com',
            'first_name': 'Mary',
            'last_name': 'Jane',
            'group': 'admin_users',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 1)
        self.assertEqual(
            response.data.get('groups'), [unicode(self.regular_users_group)]
        )

    def test_attempt_to_create_a_manager_account(self):
        """
        Visitor can create only a regular user account.
        """
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
            'email': 'mary@email.com',
            'first_name': 'Mary',
            'last_name': 'Jane',
            'group': 'manager_users',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 1)
        self.assertEqual(
            response.data.get('groups'), [unicode(self.regular_users_group)]
        )

    def test_username_alredy_exists(self):
        """
        Username have to be unique.
        """
        username = self.regular_user.username
        url = reverse('users:list_and_create')
        data = {
            'username': username,
            'password': 'some_password',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(
            response.data.get('username'),
            [u'A user with that username already exists.']
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AdminCreateAccountTests(VisitorCreateAccountTests):
    """
    Admins have all access to the user accounts.
    """
    def setUp(self):
        self.current_user = self.admin_client

    def test_attempt_to_create_an_admin_account(self):
        """
        Admin can create a user account with admin privileges.
        """
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
            'email': 'mary@email.com',
            'first_name': 'Mary',
            'last_name': 'Jane',
            'group': 'admin_users',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 1)
        self.assertEqual(
            response.data.get('groups'), [unicode(self.admins_group)]
        )

    def test_attempt_to_create_a_manager_account(self):
        """
        Admin can create a user account with manager privileges.
        """
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
            'email': 'mary@email.com',
            'first_name': 'Mary',
            'last_name': 'Jane',
            'group': 'manager_users',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 1)
        self.assertEqual(
            response.data.get('groups'), [unicode(self.managers_group)]
        )


class ManagerCreateAccountTests(VisitorCreateAccountTests):
    """
    This TestCate is created to test manager permissions and restrictions
    to create user account.

    Managers can create a regular but not manager or admin user accounts.
    """
    def setUp(self):
        self.current_user = self.manager_client


class RegularUserCreateAccountTests(VisitorCreateAccountTests):
    """
    This TestCate is created to test regular user permissions and restrictions
    to create user account.

    Regular user can not create new user accounts while he's logged in.
    """
    def setUp(self):
        self.current_user = self.regular_user_client

    def test_creates_regular_user_account(self):
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_creates_full_regular_user_account(self):
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
            'email': 'mary@email.com',
            'first_name': 'Mary',
            'last_name': 'Jane',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_attemps_to_create_account_without_password(self):
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary'
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_attemps_to_create_account_without_username(self):
        url = reverse('users:list_and_create')
        data = {
            'password': 'mary'
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_attempt_to_create_an_admin_account(self):
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
            'email': 'mary@email.com',
            'first_name': 'Mary',
            'last_name': 'Jane',
            'group': 'admin_users',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_attempt_to_create_a_manager_account(self):
        url = reverse('users:list_and_create')
        data = {
            'username': 'mary',
            'password': 'mary',
            'email': 'mary@email.com',
            'first_name': 'Mary',
            'last_name': 'Jane',
            'group': 'manager_users',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_username_alredy_exists(self):
        username = self.regular_user.username
        url = reverse('users:list_and_create')
        data = {
            'username': username,
            'password': 'some_password',
        }
        response = self.current_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # def test_only_admin_can_change_user_group(self):
    #     """
    #     Only user with admin privileges can manage user group.
    #     """
    #     pass

    # def test_regular_users_can_not_access_to_the_user_list(self):
    #     """
    #     Regular users has no access to get a list of users.
    #     """
    #     pass
