import pytest
from django.urls import reverse
from django.test import Client
from unittest.mock import patch
import json

@pytest.fixture
def client():
    return Client()


@patch('api.views.train_model')
@patch('api.views.predict')
def test_predict_stock(mock_predict, mock_train_model, client):
    mock_train_model.return_value = 'mock_scaler'
    mock_predict.return_value = 150.0

    response = client.get(reverse('predict_stock'), {
        'ticker': 'AAPL',
        'period': '1y',
        'interval': '1d'
    })

    assert response.status_code == 200
    data = json.loads(response.content)
    assert 'predicted_price' in data
    assert data['predicted_price'] == 150