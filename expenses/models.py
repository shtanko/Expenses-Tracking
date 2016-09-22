from __future__ import unicode_literals

from django.db import models

from users.models import User


class Expense(models.Model):
    """
    This class describes main application model, every object witch represents
    a user expense, that have
    .name   --  short description of an item, often a type of expense
    .descr  --  optionnal field that contains full description that user want
                to add to that item
    .dt     --  date and time, then expense was done
    .value  --  actually an expense value in USD
    """
    name = models.CharField(max_length=100)
    descr = models.TextField()
    dt = models.DateTimeField()
    value = models.FloatField()
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
