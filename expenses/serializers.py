from rest_framework import serializers

from expenses.models import Expense


class AdminExpenseSerializer(serializers.ModelSerializer):
    """
    Expense serializer class for admins.
    """
    url = serializers.HyperlinkedIdentityField(view_name='expenses:detail')

    class Meta():
        model = Expense
        fields = '__all__'


class NotAdminExpenseSerializer(serializers.ModelSerializer):
    """
    Expense serializer for regular users and managers.
    """
    url = serializers.HyperlinkedIdentityField(view_name='expenses:detail')

    class Meta():
        model = Expense
        exclude = ('owner',)
