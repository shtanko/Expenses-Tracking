from rest_framework import permissions as drf_perm
from users import permissions as user_perm


class ExpensePermissions(drf_perm.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        current_user = request.user
        if user_perm.is_admin(current_user):
            return True
        else:
            return current_user == obj.owner
        return False
