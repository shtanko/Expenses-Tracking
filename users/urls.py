from django.conf.urls import url

from users import views


app_name = 'users'

user_list = views.UserViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

user_detail = views.UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [
    url(r'^$', user_list, name='list'),
    url(r'^(?P<pk>[0-9]+)/$', user_detail, name='detail'),
]