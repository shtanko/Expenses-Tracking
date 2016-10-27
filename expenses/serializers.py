from rest_framework.serializers import ModelSerializer

from expenses.models import Expense


class AdminExpenseSerializer(ModelSerializer):
    class Meta():
        model = Expense
        fields = '__all__'


class NotAdminExpenseSerializer(ModelSerializer):
    class Meta():
        model = Expense
        exclude = ('owner',)
