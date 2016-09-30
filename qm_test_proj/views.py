from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users':
            reverse(
                'users:list',
                request=request,
                format=format
            ),
        'expenses':
            reverse(
                'expenses:list_and_create',
                request=request,
                format=format
            )
    })
