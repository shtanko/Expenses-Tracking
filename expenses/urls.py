from django.conf.urls import url

from expenses.views import ExpenseViewSet

app_name = 'expenses'

expense_list = ExpenseViewSet.as_view({
    'get': 'list',
    'post': 'create',
})

expense_detail = ExpenseViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [
    url(r'^$', expense_list, name='list_and_create'),
    url(r'^(?P<pk>[0-9]+)/$', expense_detail, name='detail'),
]
