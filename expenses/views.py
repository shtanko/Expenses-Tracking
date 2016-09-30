from rest_framework import generics
from rest_framework import permissions

from expenses.models import Expense
from expenses.serializers import ExpenseSerializer
from expenses.permissions import IsOwnerOrAdmin


class ExpenseListCreate(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwnerOrAdmin,
    )

    def get_queryset(self):
        username = self.request.user.username
        queryset = Expense.objects.filter(owner__username=username)
        return queryset


class ExpenseRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwnerOrAdmin,
    )
