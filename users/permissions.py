from django.db.models import Q
from django.contrib.auth.models import Group

from rest_framework.permissions import BasePermission, IsAuthenticated


def is_admin_or_manager(user):
    return user.groups.filter(
        Q(name='manager_users') | Q(name='admin_users')
    ).exists()


def is_admin(user):
    return user.groups.filter(name='admin_users').exists()


def is_manager(user):
    return user.groups.filter(name='manager_users').exists()


def set_regular_user_permissions_to(user):
    regular_users_group = Group.objects.get(name='regular_users')
    user.groups.set([regular_users_group])
    user.save()


class UserPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        if user.is_authenticated():
            # Only andmins or user managers could view a list of users and
            # create new users (unauthenticated users can register a new
            # account, but already registered and authenticated regular
            # users can not create new user instances).
            if view.action in ['list', 'create']:
                if is_admin_or_manager(user):
                    return True
            # Permissions to other view actions like `retrieve`, `update`,
            # `partial_update` and `destroy` are granted to all registered
            # users.
            else:
                return True
        else:
            # If user does not authenticated it can only create new instance
            # (another words, to register a new account).
            if view.action == 'create':
                return True
        return False

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_authenticated():
            if user == obj:
                return True
            else:
                if view.action == 'retrieve' and is_admin_or_manager(user):
                    return True
                if is_manager(user) and not is_admin_or_manager(obj):
                    return True
                if is_admin(user):
                    return True
        else:
            # If user does not authenticated it can only create new instance
            # (another words, to register a new account).
            if view.action == 'create':
                return True
        return False


class GroupPermissions(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        if view.action in ('list', 'retrieve'):
            return True
        return False
