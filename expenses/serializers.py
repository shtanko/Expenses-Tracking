from rest_framework import serializers

from expenses.models import Expense


class AdminExpenseSerializer(serializers.ModelSerializer):
    """
    Expense serializer class for admins.
    """
    class Meta():
        model = Expense
        fields = '__all__'


class NotAdminExpenseSerializer(serializers.ModelSerializer):
    """
    Expense serializer for regular users and managers.
    """
    class Meta():
        model = Expense
        fields = ('name', 'descr', 'value',)
