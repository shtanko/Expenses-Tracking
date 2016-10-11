from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User

from expenses.models import Expense
from expenses.tests.base import APITestCaseWithTestData, \
    get_expense_ids_from_user


class VisitorDeleteExpenseTests(APITestCaseWithTestData):
    """
    Visitor can not delete any Expense objects.
    """
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
            response = self.current_client.delete(url)
            self.assertContains(
                response,
                u'credentials were not provided',
                count=1,
                status_code=status.HTTP_403_FORBIDDEN
            )

    def test_delete_regular_user_exp(self):
        self.main_test_for_user(self.another_regular_user)

    def test_delete_manager_exp(self):
        self.main_test_for_user(self.another_manager_user)

    def test_delete_admin_exp(self):
        self.main_test_for_user(self.another_admin_user)

    def test_delete_self_exp(self):
        pass


class RegularUserDeleteExpenseTests(VisitorDeleteExpenseTests):
    """
    Regular user can delete only self Expense objects.
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
            response = self.current_client.delete(url)
            self.assertContains(
                response,
                u'Not found',
                count=1,
                status_code=status.HTTP_404_NOT_FOUND
            )

    def test_delete_self_exp(self):
        user_expense_ids = get_expense_ids_from_user(self.current_user)
        for exp_id in user_expense_ids:
            url = reverse(
                'expenses:detail',
                kwargs={
                    'pk': exp_id,
                }
            )
            response = self.current_client.delete(url)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class ManagerDeleteExpenseTests(RegularUserDeleteExpenseTests):
    """
    Manager user can delete only self Expense objects.
    """
    def setUp(self):
        self.current_client = self.manager_client
        self.current_user = self.manager_user


class AdminDeleteExpenseTests(ManagerDeleteExpenseTests):
    """
    Admin user can delete any Expense objects.
    """
    def setUp(self):
        self.current_client = self.admin_client
        self.current_user = self.admin_user

    def main_test_for_user(self, user):
        user_expense_ids = get_expense_ids_from_user(user)
        for exp_id in user_expense_ids:
            url = reverse(
                'expenses:detail',
                kwargs={
                    'pk': exp_id,
                }
            )
            response = self.current_client.delete(url)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_self_exp(self):
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
            }
            response = self.current_client.delete(url, data)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
