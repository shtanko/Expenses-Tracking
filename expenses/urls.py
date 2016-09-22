from django.conf.urls import url

from expenses import views

app_name = 'expenses'
urlpatterns = [
    url(r'^$', views.ExpenseList.as_view(), name='list'),
    url(r'^(?P<pk>[0-9]+)/$', views.ExpenseDetail.as_view(), name='detail'),
]
