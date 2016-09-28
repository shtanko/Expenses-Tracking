from rest_framework import viewsets

from users.models import User
from users.serializers import UserSerializer
from users.permissions import UserPermission


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (UserPermission,)

    def perform_update(self, serializer):
        serializer.save(current_user=self.request.user)
