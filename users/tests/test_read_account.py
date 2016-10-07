from django.contrib.auth.models import Group
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from users.models import User


class VisitorReadAccountTests(APITestCase):
    """
    This TestCate is created to test visitor permissions and restrictions
    to update user account.

    Basicly, visitor can only create new account.
    """
    def setUp(self):
        self.current_client = self.client

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

        cls.dublicate_admin_user = User.objects.create_user(
            username='dubl_root',
            password='dubl_root',
            email='dubl_root@email.com',
            first_name='dubl_Iosiff',
            last_name='dubl_Stalihn'
        )
        cls.dublicate_manager_user = User.objects.create_user(
            username='dubl_manager',
            password='dubl_manager',
            email='dubl_manager@email.com',
            first_name='dubl_Steve',
            last_name='dubl_Jobs'
        )
        cls.dublicate_regular_user = User.objects.create_user(
            username='dubl_regular',
            password='dubl_regular',
            email='dubl_regular_user@email.com',
            first_name='dubl_Vasiliy',
            last_name='dubl_Puphkin'
        )

        cls.dublicate_admin_user.groups.set([cls.admins_group])
        cls.dublicate_manager_user.groups.set([cls.managers_group])
        cls.dublicate_regular_user.groups.set([cls.regular_users_group])

    def test_read_regular_user_account(self):
        """
        Visitor can not read any information until get registered or logged in.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_read_manager_user_account(self):
        """
        Visitor can not read any information until get registered or logged in.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_read_admin_user_account(self):
        """
        Visitor can not read any information until get registered or logged in.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_read_self_account(self):
        """
        Visitor can not read any information until get registered or logged in.
        """
        pass

    def test_read_user_list(self):
        """
        Visitor can not read any information until get registered or logged in.
        """
        url = reverse('users:list_and_create',)
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class RegularUserReadTests(VisitorReadAccountTests):
    """
    Regular user can read only self account information.
    """
    def setUp(self):
        self.current_client = self.regular_user_client

    def test_read_self_account(self):
        """
        Visitor can not read any information until get registered or logged in.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.regular_user.id}
        )
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ManagerReadTests(RegularUserReadTests):
    """
    Managers can read any user information.
    """
    def setUp(self):
        self.current_client = self.manager_client

    def test_read_regular_user_account(self):
        """
        Manager can read any user information.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_read_manager_user_account(self):
        """
        Manager can read any user information.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_read_admin_user_account(self):
        """
        Manager can read any user information.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_read_user_list(self):
        """
        Manager can read any user information.
        """
        url = reverse('users:list_and_create',)
        response = self.current_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AdminReadTests(ManagerReadTests):
    """
    Managers can read any user information.
    """
    def setUp(self):
        self.current_client = self.admin_client
