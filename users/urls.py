from django.conf.urls import url

from users import views

app_name = 'users'
urlpatterns = [
    url(r'^$', views.UserList.as_view(), name='list'),
    url(r'^(?P<pk>[0-9]+)/$', views.UserDetail.as_view(), name='detail'),
]
