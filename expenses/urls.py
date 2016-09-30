from django.conf.urls import url

from expenses import views

app_name = 'expenses'
urlpatterns = [
    url(
        r'^$',
        views.ExpenseListCreate.as_view(),
        name='list_and_create'
    ),
    url(
        r'^(?P<pk>[0-9]+)/$',
        views.ExpenseRetrieveUpdateDestroy.as_view(),
        name='detail'
    ),
]
