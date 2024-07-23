# models.py
from django.db import models

class Portfolio(models.Model):
    user_id = models.CharField(max_length=255)  # Store user ID from MongoDB
    cash_balance = models.DecimalField(max_digits=12, decimal_places=2)
    # Other fields...

class Stock(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    ticker = models.CharField(max_length=10)
    shares = models.DecimalField(max_digits=12, decimal_places=2)
    # Other fields...

class Transaction(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    ticker = models.CharField(max_length=10)
    shares = models.DecimalField(max_digits=12, decimal_places=2)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=10)
    # Other fields...
