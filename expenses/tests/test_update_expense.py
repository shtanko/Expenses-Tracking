from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User

from expenses.models import Expense
from expenses.tests.base import CreateDataMethodsForTestCase, \
    get_expense_ids_from_user


class VisitorUpdateExpenseTests(APITestCase, CreateDataMethodsForTestCase):
    """
    Visitor can not update any Expense objects.
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

    def main_test_for_user(self, user):
        user_expense_ids = get_expense_ids_from_user(user)
        for exp_id in user_expense_ids:
            url = reverse(
                'expenses:detail',
                kwargs={
                    'pk': exp_id,
                }
            )
            data = {
                'name': 'new_name',
                'descr': 'New description.',
                'value': 322,
            }
            response = self.current_client.put(url, data)
            self.assertContains(
                response,
                u'credentials were not provided',
                count=1,
                status_code=status.HTTP_403_FORBIDDEN
            )

    def test_update_regular_user_exp(self):
        self.main_test_for_user(self.another_regular_user)

    def test_update_manager_exp(self):
        self.main_test_for_user(self.another_manager_user)

    def test_update_admin_exp(self):
        self.main_test_for_user(self.another_admin_user)

    def test_update_self_exp(self):
        pass


class RegularUserUpdateExpenseTests(VisitorUpdateExpenseTests):
    """
    Regular user can update only self Expense objects.
    """
    def setUp(self):
        self.current_client = self.regular_user_client
        self.current_user = self.regular_user

    def main_test_for_user(self, user):
        user_expense_ids = get_expense_ids_from_user(user)
        for exp_id in user_expense_ids:
            url = reverse(
                'expenses:detail',
                kwargs={
                    'pk': exp_id,
                }
            )
            data = {
                'name': 'new_name',
                'descr': 'New description.',
                'value': 322,
                'owner': self.regular_user.id,
            }
            response = self.current_client.put(url, data)
            self.assertContains(
                response,
                u'Not found',
                count=1,
                status_code=status.HTTP_404_NOT_FOUND
            )

    def test_update_self_exp(self):
        user_expense_ids = get_expense_ids_from_user(self.current_user)
        for exp_id in user_expense_ids:
            url = reverse(
                'expenses:detail',
                kwargs={
                    'pk': exp_id,
                }
            )
            data = {
                'name': 'new_name',
                'descr': 'New description.',
                'value': 322,
                'owner': self.admin_user.id,
            }
            response = self.current_client.put(url, data)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(
                Expense.objects.filter(owner__id=self.current_user.id).count(),
                self.default_item_number
            )


class ManagerUpdateExpenseTests(RegularUserUpdateExpenseTests):
    """
    Regular user can update only self Expense objects.
    """
    def setUp(self):
        self.current_client = self.manager_client
        self.current_user = self.manager_user


class AdminUpdateExpenseTests(ManagerUpdateExpenseTests):
    """
    Regular user can update only self Expense objects.
    """
    def setUp(self):
        self.current_client = self.admin_client
        self.current_user = self.admin_user

    def main_test_for_user(self, user_from, user_to):
        user_expense_ids = get_expense_ids_from_user(user_from)
        user_from_exp_num = self.default_item_number
        user_to_exp_num = self.default_item_number
        for exp_id in user_expense_ids:
            url = reverse(
                'expenses:detail',
                kwargs={
                    'pk': exp_id,
                }
            )
            data = {
                'name': 'new_name',
                'descr': 'New description.',
                'value': 322,
                'owner': user_to.id,
            }
            response = self.current_client.put(url, data)
            user_from_exp_num -= 1
            user_to_exp_num += 1
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(
                len(get_expense_ids_from_user(user_from)),
                user_from_exp_num
            )
            self.assertEqual(
                len(get_expense_ids_from_user(user_to)),
                user_to_exp_num
            )

    def test_update_regular_user_exp(self):
        self.main_test_for_user(self.another_regular_user, self.regular_user)

    def test_update_manager_exp(self):
        self.main_test_for_user(self.another_manager_user, self.manager_user)

    def test_update_admin_exp(self):
        self.main_test_for_user(self.another_admin_user, self.admin_user)

    def test_update_self_exp(self):
        user_expense_ids = get_expense_ids_from_user(self.current_user)
        for exp_id in user_expense_ids:
            url = reverse(
                'expenses:detail',
                kwargs={
                    'pk': exp_id,
                }
            )
            data = {
                'name': 'new_name',
                'descr': 'New description.',
                'value': 322,
                'owner': self.current_user.id,
            }
            response = self.current_client.put(url, data)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(
                Expense.objects.filter(owner__id=self.current_user.id).count(),
                self.default_item_number
            )
