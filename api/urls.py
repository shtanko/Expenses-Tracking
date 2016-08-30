from django.conf.urls import url, include

urlpatterns = [
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework'))
]