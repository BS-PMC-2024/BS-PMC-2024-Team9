from django.urls import path, include
from .views import get_stock_data, predict_stock  

urlpatterns = [
    path('stock-data/', get_stock_data, name='get_stock_data'),
    path('predict/', predict_stock, name='predict_stock'),
]


