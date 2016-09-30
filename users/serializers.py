from django.contrib.auth.models import Group
from rest_framework import serializers

from users import permissions
from users.models import User
# from expenses.models import Expense


# class UserSerializer(serializers.ModelSerializer):
class UserSerializer(serializers.HyperlinkedModelSerializer):
    """
    Docstring for class UserSerializer
    """
    # expenses = serializers.PrimaryKeyRelatedField(
    #     allow_null=True,
    #     many=True,
    #     queryset=Expense.objects.all()
    # )
    expenses = serializers.HyperlinkedRelatedField(
        view_name='expenses:detail',
        many=True,
        read_only=True
    )
    # groups = serializers.PrimaryKeyRelatedField(
    #     many=True,
    #     queryset=Group.objects.all()
    # )
    groups = serializers.SlugRelatedField(
        slug_field='name',
        many=True,
        queryset=Group.objects.all()
    )
    # groups = serializers.StringRelatedField(many=True)
    # expenses = serializers.StringRelatedField(many=True)

    current_user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    only_admin_editable_fields = ('groups',)

    class Meta():
        model = User
        fields = (
            'url',
            'id',
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
            'expenses',
            'groups',
            'current_user',
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'url': {'view_name': 'users:detail'},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        # Each new user has permissions of the regular users.
        regular_users = Group.objects.get(name='regular_users')
        user.groups.add(regular_users)
        return user

    def update(self, instance, validated_data):
        current_user = validated_data['current_user']
        is_admin_or_manager = (permissions.is_admin_or_manager(current_user))
        for attr, value in validated_data.items():
            if (attr in self.only_admin_editable_fields and
                    not is_admin_or_manager):
                continue
            elif attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()

        return instance
