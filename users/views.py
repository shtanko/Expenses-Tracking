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
        instance = serializer.save()

        current_user = self.request.user
        is_admin = user_permissions.is_admin(current_user)
        if not is_admin:
            user_permissions.set_regular_user_permissions_to(instance)
        instance.set_password(instance.password)

        instance.save()

    def perform_update(self, serializer):
        instance = serializer.save()

        current_user = self.request.user
        is_current_user_admin = user_permissions.is_admin(current_user)
        if not is_current_user_admin:
            user_permissions.set_regular_user_permissions_to(instance)

        if is_current_user_admin \
                or not user_permissions.is_admin_or_manager(instance):
            instance.set_password(instance.password)

        instance.save()
