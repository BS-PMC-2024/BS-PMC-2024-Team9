from django.urls import path, include
from .views import get_stock_data, predict_stock , stock_detail_view 

urlpatterns = [
    path('stock-data/', get_stock_data, name='get_stock_data'),
    path('predict/', predict_stock, name='predict_stock'),
    path('stock-detail/<str:ticker>/', stock_detail_view, name='stock_detail_view'),
]


