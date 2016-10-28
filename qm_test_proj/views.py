from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def api_root(request, format=None):
    return Response({
        'users': reverse('users:list_and_create'),
        'expenses': reverse('expenses:list_and_create'),
        'groups': reverse('users:groups:list'),
        'url_to_user_data':
            reverse('users:detail', kwargs={'pk': request.user.id}),
    })
