from rest_framework import permissions
from users import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        is_admin = permissions.is_admin(user)
        return obj.owner == user or is_admin
