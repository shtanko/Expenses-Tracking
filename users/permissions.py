from django.db.models import Q
from rest_framework.permissions import BasePermission


def is_admin_or_manager(user):
    return user.groups.filter(
        Q(name='manager_users') | Q(name='admin_users')
    ).exists()


def is_admin(user):
    return user.groups.filter(name='admin_users').exists()


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

        # Object permissions granted only to authenticated users.
        if user.is_authenticated():
            # Each user can CRUD his own account.
            if user == obj:
                return True
            else:
                # And only admins or user managers can CRUD another
                # accounts.
                if is_admin_or_manager(user):
                    return True
        else:
            # If user does not authenticated it can only create new instance
            # (another words, to register a new account).
            if view.action == 'create':
                return True
        return False
