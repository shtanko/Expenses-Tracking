from django.contrib.auth.models import Group

from rest_framework import viewsets

from users.models import User
from users import serializers as user_serializers
from users import permissions as user_permissions


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = (user_permissions.UserPermission,)

    def get_serializer_class(self):
        current_user = self.request.user
        if current_user.is_authenticated():
            if user_permissions.is_admin_or_manager(current_user):
                return user_serializers.ManagerUserSerializer
            else:
                return user_serializers.RegularUserSerializer
        else:
            return user_serializers.RegularUserSerializer

    def perform_create(self, serializer):
        current_user = self.request.user
        is_admin = user_permissions.is_admin(current_user)
        instance = serializer.save()
        new_password = instance.password
        if new_password:
            instance.set_password(new_password)
        if not is_admin:
            regular_users_group = Group.objects.get(name='regular_users')
            instance.groups.set([regular_users_group])
        instance.save()

    def perform_update(self, serializer):
        current_user = self.request.user
        is_admin = user_permissions.is_admin(current_user)
        instance = serializer.save()
        new_password = instance.password
        if new_password:
            instance.set_password(new_password)
        if not is_admin:
            regular_users_group = Group.objects.get(name='regular_users')
            instance.groups.set([regular_users_group])
        instance.save()
