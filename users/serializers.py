from rest_framework import serializers

from users.models import User
from expenses.models import Expense


class UserSerializer(serializers.ModelSerializer):
    """
    Docstring for class UserSerializer
    """
    expenses = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Expense.objects.all()
    )

    class Meta():
        model = User
        fields = ('id', 'username', 'expenses')
