from django.contrib.auth.models import Group
from rest_framework import serializers

from users import permissions
from users.models import User


def is_group_exists(group_name=None):
    if group_name:
        if not Group.objects.filter(name=group_name).exists():
            raise serializers.ValidationError(
                'Group with name %s does not exists.' % (group_name)
            )


class UserSerializer(serializers.HyperlinkedModelSerializer):
    expenses = serializers.HyperlinkedRelatedField(
        view_name='expenses:detail',
        many=True,
        read_only=True
    )

    # Throught this field user will GET list of groups which current user
    # belogns to.
    groups = serializers.SlugRelatedField(
        slug_field='name',
        many=True,
        read_only=True
    )
    # And through this field admin will POST (set) current user permissions.
    group = serializers.CharField(
        write_only=True,
        validators=[is_group_exists],
        required=False
    )
    current_user = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    only_admin_editable_fields = ('group',)

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
            'group',
            'current_user',
        )
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'}
            },
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
        user.groups.set([regular_users])
        # But admin can create user with custom permissions
        current_user = validated_data['current_user']
        if current_user:
            is_admin = (permissions.is_admin(current_user))
            group_name = validated_data['group']
            if is_admin and group_name:
                group = Group.objects.get(name=group_name)
                user.group.set([group])
        return user

    def update(self, instance, validated_data):
        current_user = validated_data['current_user']
        is_admin = (permissions.is_admin(current_user))
        for attr, value in validated_data.items():
            if (attr in self.only_admin_editable_fields and
                    not is_admin):
                continue
            elif attr == 'password':
                instance.set_password(value)
            elif attr == 'group' and value and is_admin:
                group = Group.objects.get(name=value)
                instance.groups.set([group])
            else:
                setattr(instance, attr, value)
        instance.save()

        return instance
