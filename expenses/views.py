from rest_framework import viewsets

from expenses.models import Expense
from expenses import serializers as expense_serializers
from expenses import permissions as expense_perm

from users import permissions as user_perm


class ExpenseViewSet(viewsets.ModelViewSet):
    model = Expense
    permission_classes = (expense_perm.ExpensePermissions,)

    def get_queryset(self):
        current_user = self.request.user
        is_current_user_admin = user_perm.is_admin(current_user)
        if is_current_user_admin:
            return Expense.objects.all()
        return Expense.objects.filter(owner__id=current_user.id)

    def get_serializer_class(self):
        current_user = self.request.user
        is_current_user_admin = user_perm.is_admin(current_user)
        if is_current_user_admin:
            return expense_serializers.AdminExpenseSerializer
        return expense_serializers.NotAdminExpenseSerializer

    def perform_create(self, serializer):
        current_user = self.request.user
        is_current_user_admin = user_perm.is_admin(current_user)
        if is_current_user_admin:
            serializer.save()
        else:
            serializer.save(owner=current_user)
