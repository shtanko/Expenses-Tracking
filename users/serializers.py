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
        fields = (
            'id',
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
            'expenses',
        )
        write_only_fields = ('password',)
        read_only_fields = ('id',)

    def create(self, validated_data):
        """
        Docstring for method create
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user
