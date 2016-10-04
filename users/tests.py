from django.contrib.auth.models import Group
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from users.models import User


class UserTests(APITestCase):
    """
    This TestCate is created to test user permissions and API access.
    """
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

    def test_visitor_creates_account(self):
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
        response = self.client.post(url, data)
        print
        print(response.data)
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), self.user_count + 1)
        self.assertEqual(
            response.data['groups'], [unicode(self.regular_users_group)]
        )

    def test_manager_creates_account(self):
        """
        Manager can create only a regular user account.
        """
        pass

    def test_admin_creates_account(self):
        """
        Admin can create user account and grant them manager or admin
        privileges.
        """
        pass

    def test_only_admin_can_change_user_group(self):
        """
        Only user with admin privileges can manage user group.
        """
        pass

    def test_regular_users_can_not_access_to_the_user_list(self):
        """
        Regular users has no access to get a list of users.
        """
        pass
