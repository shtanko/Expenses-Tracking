from rest_framework import serializers

from expenses.models import Expense

from users import permissions


class ExpenseSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')

    current_user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta():
        model = Expense
        fileds = (
            'id',
            'name',
            'value',
            'descr',
            'created',
            'last_modified',
            'owner_username',
        )
        extra_kwargs = {
            'owner': {'write_only': True}
        }

    def create(self, validated_data):
        current_user = validated_data.pop('current_user')
        is_admin = permissions.is_admin(current_user)
        if is_admin:
            exp = super(ExpenseSerializer, self).create(validated_data)
        else:
            exp = super(ExpenseSerializer, self).create(validated_data)
            exp.owner = current_user
        return exp
