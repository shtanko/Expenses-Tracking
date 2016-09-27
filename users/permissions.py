from django.db.models import Q
from rest_framework.permissions import BasePermission


class UserPermission(BasePermission):
    """
    Docstring for class UserPermission
    """

    def is_admin_or_manager(self, user):
        """
        Docstring for method is_admin_or_manager
        """
        return user.groups.get(
            Q(name='manager_users') | Q(name='admin_users')
        ).exists()

    def is_admin(self, user):
        """
        Docstring for method is_admin
        """
        return user.groups.get(name='admin_users').exists()

    def has_permission(self, request, view):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        user = request.user

        if user.is_authenticated():
            # Only andmins or user managers could view a list of users and
            # create new users (unauthenticated users can register a new
            # account, but already registered and authenticated regular
            # users can not create new user instances).
            if view.action in ['list', 'create']:
                if self.is_admin_or_manager(user):
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
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        user = request.user

        # Object permissions granted only to authenticated users.
        if user.is_authenticated():
            # Each user can CRUD his own account.
            if user == obj:
                return True
            else:
                # And only admins or user managers can CRUD another
                # accounts.
                if self.is_admin_or_manager(user):
                    return True
        else:
            # If user does not authenticated it can only create new instance
            # (another words, to register a new account).
            if view.action == 'create':
                return True
        return False
