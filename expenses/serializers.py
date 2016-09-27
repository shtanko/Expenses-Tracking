from rest_framework import serializers

from expenses.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    """
    Docstring for class ExpenseSerializer
    """
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta():
        model = Expense
        fileds = (
            'id',
            'name',
            'value',
            'descr',
            'created',
            'last_modified',
            'owner',
        )
