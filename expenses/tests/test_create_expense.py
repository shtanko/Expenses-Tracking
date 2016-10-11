from django.urls import reverse

from rest_framework import status

from users.models import User
from expenses.models import Expense

from expenses.tests.base import APITestCaseWithTestData


class VisitorCreateExpenseTests(APITestCaseWithTestData):
    """
    Visitor can not create any Expense object because they have to be bounded
    to the user who created them.
    """
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
