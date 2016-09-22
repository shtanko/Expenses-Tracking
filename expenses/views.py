from rest_framework import generics
from rest_framework import permissions

from expenses.models import Expense
from expenses.serializers import ExpenseSerializer
from expenses.permissions import IsOwner


class ExpenseList(generics.ListAPIView):
    # queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        username = self.request.user.username
        queryset = Expense.objects.filter(owner__username=username)
        return queryset


class ExpenseDetail(generics.RetrieveAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = (
        permissions.IsAuthenticated,
        IsOwner,
    )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
