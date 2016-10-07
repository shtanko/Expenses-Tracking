from django.contrib.auth.models import Group
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from users.models import User


class VisitorUpdateAccountTests(APITestCase):
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

    def test_update_regular_user_username(self):
        """
        Visitor can not update username of the regular user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
            'password': 'new_password_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_regular_user_username_without_password(self):
        """
        Visitor can not update username of the regular user.
        But without password user can not put data even if he has
        appropriate credentials.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_regular_user_secondary_fields(self):
        """
        Visitor can not update any seondary fields of the regular user.
        But authenticated user can, so that is why this test exists.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_manager_username(self):
        """
        Visitor can not update username of the manager user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'username': 'new_username_for_manager_user',
            'password': 'new_password_for_manager_user',
        }
        response = self.current_client.put(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_manager_username_without_password(self):
        """
        Visitor can not update username of the manager user.
        But without password user can not put data even if he has
        appropriate credentials.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_manager_secondary_fields(self):
        """
        Visitor can not update any seondary fields of the manager user.
        But authenticated user can, so that is why this test exists.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_admin_username(self):
        """
        Visitor can not update username of the admin user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'username': 'new_username_for_admin_user',
            'password': 'new_password_for_admin_user',
        }
        response = self.current_client.put(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_admin_username_without_password(self):
        """
        Visitor can not update username of the admin user.
        But without password user can not put data even if he has
        appropriate credentials.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_admin_secondary_fields(self):
        """
        Visitor can not update any seondary fields of the admin user.
        But authenticated user can, so that is why this test exists.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_update_self_account_username(self):
        pass

    def test_update_self_account_username_without_password(self):
        pass

    def test_update_self_account_secondary_fields(self):
        pass


class RegularUserUpdateAccountTests(VisitorUpdateAccountTests):
    """
    Regular user can edit only self account fields.
    """
    def setUp(self):
        self.current_client = self.regular_user_client

    def test_update_self_account_username(self):
        """
        Regular user can update username of the self account. But he should to
        provide password.
        """
        url = reverse('users:detail', kwargs={'pk': self.regular_user.id})
        data = {
            'username': 'new_username_for_admin_user',
            'password': 'new_password_for_admin_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_self_account_username_without_password(self):
        """
        Regular user can update username of the self account. But he should to
        provide password.
        """
        url = reverse('users:detail', kwargs={'pk': self.regular_user.id})
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_self_account_secondary_fields(self):
        """
        Regular user can update any seondary fields of the self account.
        """
        url = reverse('users:detail', kwargs={'pk': self.regular_user.id})
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_regular_user_username(self):
        """
        Regular user can not update username of another regular user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
            'password': 'new_password_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_regular_user_username_without_password(self):
        """
        Regular user can not update username of another regular user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_regular_user_secondary_fields(self):
        """
        Regular user can not update any seondary fields of the another regular
        user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_manager_username(self):
        """
        Regular user can not update username of the manager user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'username': 'new_username_for_manager_user',
            'password': 'new_password_for_manager_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_manager_username_without_password(self):
        """
        Regular user can not update username of the manager user.
        But without password user can not put data even if he has
        appropriate credentials.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_manager_secondary_fields(self):
        """
        Regular user can not update any seondary fields of the manager user.
        But authenticated user can, so that is why this test exists.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_admin_username(self):
        """
        Regular user can not update username of the admin user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'username': 'new_username_for_admin_user',
            'password': 'new_password_for_admin_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_admin_username_without_password(self):
        """
        Regular user can not update username of the admin user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_admin_secondary_fields(self):
        """
        Regular user can not update any seondary fields of the admin user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ManagerUserUpdateAccountTests(RegularUserUpdateAccountTests):
    """
    Managers can update self and regular user accounts.
    """
    def setUp(self):
        self.current_client = self.manager_client

    def test_update_regular_user_username(self):
        """
        Manager user can update username of the any regular user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
            'password': 'new_password_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_regular_user_username_without_password(self):
        """
        Manager user can update username of the any regular user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_regular_user_secondary_fields(self):
        """
        Manager user can update any seondary fields of the any regular
        user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_regular_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_self_account_username_without_password(self):
        """
        Manager user can update username of the self account without password
        """
        url = reverse('users:detail', kwargs={'pk': self.regular_user.id})
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AdminUpdateAccountTests(ManagerUserUpdateAccountTests):
    """
    And admin user can update any user account information.
    """
    def setUp(self):
        self.current_client = self.admin_client

    def test_update_manager_username(self):
        """
        Regular user can not update username of the manager user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'username': 'new_username_for_manager_user',
            'password': 'new_password_for_manager_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_manager_username_without_password(self):
        """
        Regular user can not update username of the manager user.
        But without password user can not put data even if he has
        appropriate credentials.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_manager_secondary_fields(self):
        """
        Regular user can not update any seondary fields of the manager user.
        But authenticated user can, so that is why this test exists.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_manager_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_admin_username(self):
        """
        Regular user can not update username of the admin user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'username': 'new_username_for_admin_user',
            'password': 'new_password_for_admin_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_admin_username_without_password(self):
        """
        Regular user can not update username of the admin user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'username': 'new_username_for_regular_user',
        }
        response = self.current_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_admin_secondary_fields(self):
        """
        Regular user can not update any seondary fields of the admin user.
        """
        url = reverse(
            'users:detail',
            kwargs={'pk': self.dublicate_admin_user.id}
        )
        data = {
            'first_name': 'new_first_name',
            'last_name': 'new_last_name',
            'email': 'new_email@gmail.com',
        }
        response = self.current_client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
