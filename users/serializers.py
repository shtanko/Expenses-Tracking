from django.contrib.auth.models import Group
from rest_framework import serializers

from users import permissions as user_permissions
from users.models import User


class RegularUserSerializer(serializers.ModelSerializer):
    """
    Serializer class that will use for regular users.
    """
    class Meta():
        model = User
        fields = (
            'id',
            'username',
            'password',
            'email',
            'first_name',
            'last_name',
        )
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'},
            },
        }


class ManagerUserSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serializer class that will be used by user admins and managers.
    """
    expenses = serializers.HyperlinkedRelatedField(
        view_name='expenses:detail',
        many=True,
        read_only=True
    )
    groups = serializers.PrimaryKeyRelatedField(
        many=True,
        required=False,
        queryset=Group.objects.all()
    )

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
        )
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'},
                'required': False,
            },
            'url': {'view_name': 'users:detail'},
        }

    def create(self, validated_data):
        if not validated_data.get('groups'):
            validated_data['groups'] = [
                Group.objects.get(name='regular_users').id,
            ]
        if not validated_data.get('password'):
            validated_data['password'] = validated_data['username']
        return super(ManagerUserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        # If "groups" field has not been passed we have to force it passing.
        # Otherwise instance's "groups" will be dropped.
        if not validated_data.get('groups'):
            validated_data['groups'] = instance.groups.values_list(
                'id',
                flat=True
            )
        else:
            # If "groups" field was provided, we have to make sure that user
            # that got attempt to change user privileges has admin's
            # permissions.
            # That's because only admins are able to update user
            # permissions. Otherwise managers will be able to grant to self
            # admin's privileges.
            current_user = validated_data.pop('current_user')
            if not user_permissions.is_admin(current_user):
                validated_data['groups'] = instance.groups.values_list(
                    'id',
                    flat=True
                )
        return super(ManagerUserSerializer, self).update(
            instance, validated_data
        )
