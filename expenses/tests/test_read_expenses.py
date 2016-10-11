from django.urls import reverse

from rest_framework import status

from expenses.tests.base import APITestCaseWithTestData, \
    get_expense_ids_from_user, get_expense_ids_from_response


class VisitorReadExpenseTests(APITestCaseWithTestData):
    """
    Visitor can not read any Expense object.
    """

    def setUp(self):
        self.current_client = self.client

    def test_read_regular_user_expenses(self):
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_read_manager_expenses(self):
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_read_admin_expenses(self):
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )

    def test_read_self_expenses(self):
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        self.assertContains(
            response,
            u'credentials were not provided',
            count=1,
            status_code=status.HTTP_403_FORBIDDEN
        )


class RegularUserReadExpenseTests(VisitorReadExpenseTests):
    """
    Regular can read only self Expense object.
    """
    def setUp(self):
        self.current_client = self.regular_user_client
        self.current_user = self.regular_user

    def test_read_regular_user_expenses(self):
        cur_urs_exp_ids = get_expense_ids_from_user(self.another_regular_user)
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        ids_from_resp = get_expense_ids_from_response(response)
        self.assertFalse(cur_urs_exp_ids == ids_from_resp)

    def test_read_manager_expenses(self):
        cur_urs_exp_ids = get_expense_ids_from_user(self.another_manager_user)
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        ids_from_resp = get_expense_ids_from_response(response)
        self.assertFalse(cur_urs_exp_ids == ids_from_resp)

    def test_read_admin_expenses(self):
        cur_urs_exp_ids = get_expense_ids_from_user(self.another_admin_user)
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        ids_from_resp = get_expense_ids_from_response(response)
        self.assertFalse(cur_urs_exp_ids == ids_from_resp)

    def test_read_self_expenses(self):
        cur_urs_exp_ids = get_expense_ids_from_user(self.current_user)
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        ids_from_resp = get_expense_ids_from_response(response)
        self.assertTrue(cur_urs_exp_ids == ids_from_resp)


class ManagerReadExpenseTests(RegularUserReadExpenseTests):
    """
    Manager can read only self Expense object.
    """
    def setUp(self):
        self.current_client = self.manager_client
        self.current_user = self.manager_user


class AdminReadExpenseTests(RegularUserReadExpenseTests):
    """
    Admin can read any Expense class item that exists.
    """
    def setUp(self):
        self.current_client = self.admin_client
        self.current_user = self.admin_user

    def test_read_regular_user_expenses(self):
        cur_urs_exp_ids = get_expense_ids_from_user(self.another_regular_user)
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        ids_from_resp = get_expense_ids_from_response(response)
        self.assertTrue(cur_urs_exp_ids <= ids_from_resp)

    def test_read_manager_expenses(self):
        cur_urs_exp_ids = get_expense_ids_from_user(self.another_manager_user)
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        ids_from_resp = get_expense_ids_from_response(response)
        self.assertTrue(cur_urs_exp_ids <= ids_from_resp)

    def test_read_admin_expenses(self):
        cur_urs_exp_ids = get_expense_ids_from_user(self.another_admin_user)
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        ids_from_resp = get_expense_ids_from_response(response)
        self.assertTrue(cur_urs_exp_ids <= ids_from_resp)

    def test_read_self_expenses(self):
        cur_urs_exp_ids = get_expense_ids_from_user(self.current_user)
        url = reverse('expenses:list_and_create')
        response = self.current_client.get(url)
        ids_from_resp = get_expense_ids_from_response(response)
        self.assertTrue(cur_urs_exp_ids <= ids_from_resp)
