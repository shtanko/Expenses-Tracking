from __future__ import unicode_literals

from django.db import models

from users.models import User


class Expense(models.Model):
    """
    This class describes main application model, every object witch represents
    a user expense, that have

    name:
        short description of an item, often a type of expense
    descr:
        optionnal field that contains full description that user want to add
        to that item
    created:
        date and time, then expense was commited
    last_modified:
        date and time of the last Expense.save() running
    value:
        actually an expense value in USD
    """
    name = models.CharField(max_length=100, blank=False)
    descr = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    value = models.FloatField(default=0.0, blank=False)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
