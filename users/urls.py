from django.conf.urls import url, include

from users import views


app_name = 'users'

user_group_list = views.GroupViewSet.as_view({
    'get': 'list'
})

user_group_detail = views.GroupViewSet.as_view({
    'get': 'retrieve'
})

user_group_patterns = ([
    url(r'^$', user_group_list, name='list'),
    url(r'^(?P<pk>[0-9]+)/$', user_group_detail, name='detail'),
], 'groups')

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
    url(r'^groups/$', include(user_group_patterns)),
    url(r'^$', user_list, name='list_and_create'),
    url(r'^(?P<pk>[0-9]+)/$', user_detail, name='detail'),
]
