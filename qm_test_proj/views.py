from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def api_root(request, format=None):
    return Response({
        'users':
            reverse(
                'users:list_and_create',
                request=request,
                format=format
            ),
        'expenses':
            reverse(
                'expenses:list_and_create',
                request=request,
                format=format
            ),
        'url_to_user_data':
            reverse(
                'users:detail',
                request=request,
                format=format,
                kwargs={'pk': request.user.id}
            ),
        'groups':
            reverse(
                'users:groups:list',
                request=request,
                format=format
            ),
    })
