from rest_framework.serializers import HyperlinkedIdentityField


class RelativeHyperlinkedIdentityField(HyperlinkedIdentityField):
    def get_url(self, obj, view_name, request, format):
        """
        Given an object, return the relative URL that hyperlinks to the object.

        May raise a `NoReverseMatch` if the `view_name` and `lookup_field`
        attributes are not configured to correctly match the URL conf.
        """
        # Unsaved objects will not yet ha ve a valid URL.
        if hasattr(obj, 'pk') and obj.pk in (None, ''):
            return None

        lookup_value = getattr(obj, self.lookup_field)
        kwargs = {self.lookup_url_kwarg: lookup_value}
        return self.reverse(view_name, kwargs=kwargs)
