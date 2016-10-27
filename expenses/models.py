from __future__ import unicode_literals

from django.db import models

from users.models import User


class Expense(models.Model):
    name = models.CharField(max_length=100, blank=False)
    descr = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    value = models.FloatField(default=0.0, blank=False)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
