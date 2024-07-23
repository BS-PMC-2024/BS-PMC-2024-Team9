from ctypes import util
import numpy as np
from django.shortcuts import render
import yfinance as yf
import time
from django.core.cache import cache
from newsapi import NewsApiClient
from django.http import JsonResponse
from .lstm_model import train_model, predict
import pusher
from django.http import JsonResponse



# Initialize the NewsApiClient with your API key
newsapi = NewsApiClient(api_key='941c905a04a24e6c8edee618209cf60e')
#cnnc531r01qq36n63pt0cnnc531r01qq36n63ptg
def get_stock_data(request):
    ticker = request.GET.get('ticker')
    period = request.GET.get('period', '1y')
    interval = request.GET.get('interval', '1d')
    ma_windows = request.GET.getlist('ma_windows[]')
    strategy = request.GET.get('strategy')
    from_date = request.GET.get('from_date')
    to_date = request.GET.get('to_date')

    if not ticker:
        return JsonResponse({'error': 'Ticker is required'}, status=400)

    # Set default period if not provided
    if not period:
        if interval in ['1m', '2m', '5m', '15m', '30m', '60m', '90m']:
            period = '60d'
        else:
            period = '1y'

    try:
        now = time.time()
        last_request_time = cache.get(f'last_request_time_{ticker}')
        if last_request_time:
            elapsed_time = now - last_request_time
            if elapsed_time < 1:
                time.sleep(1 - elapsed_time)

        # Update the last request time in cache
        cache.set(f'last_request_time_{ticker}', now, timeout=None)

        # Fetch stock data

     
        data = yf.download(ticker, period=period,interval=interval)
        if data.empty:
            return JsonResponse({'error': 'No data found'}, status=404)

        # Calculate moving averages based on provided windows
        for window in ma_windows:
            try:
                window = int(window)
                data[f'MA{window}'] = data['Close'].rolling(window=window).mean()
            except ValueError:
                continue
        # Convert data to native Python types
        #data = data.astype(float).reset_index()
        
        # Apply trading strategy
        trades, success_rate = apply_strategy(data, strategy)

        # Fetch news articles related to the ticker
        all_articles = newsapi.get_everything(q=ticker, from_param=from_date, to=to_date, language='en', sort_by='popularity')
        # Check for new articles and send notification
        latest_article_time = cache.get(f'latest_article_time_{ticker}')
        new_articles = []

        for article in all_articles['articles']:
            published_at = article['publishedAt']
            if latest_article_time is None or published_at > latest_article_time:
                new_articles.append(article)
                pusher_client.trigger('news_channel', 'new_article', {
                    'title': article['title'],
                    'description': article['description'],
                    'url': article['url'],
                    'date': published_at
                })

        if new_articles:
            latest_article_time = new_articles[0]['publishedAt']
            cache.set(f'latest_article_time_{ticker}', latest_article_time, timeout=None)
            
        news_data = [{'title': article['title'], 'description': article['description'], 'url': article['url'], 'date': article['publishedAt']} for article in all_articles['articles']]
        columns = ['Open', 'High', 'Low', 'Close', 'Volume'] + [f'MA{window}' for window in ma_windows]
        stock_data = data[columns].dropna().reset_index().to_dict(orient='records')
        #stock_data = [{k: (float(v) if isinstance(v, np.float32) else v) for k, v in item.items()} for item in stock_data]
        response_data = {
            'ticker': ticker,
            'stockdata': stock_data,
            'newsdata': news_data,
            'trades': trades,
            'success_rate':success_rate
        }

        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def apply_strategy(data, strategy):
    if strategy == 'ma_crossover':
        return ma_crossover_strategy(data)
    elif strategy == 'rsi':
        return rsi_strategy(data)
    else:
        return [],0

def ma_crossover_strategy(data):
    # Define simple moving average crossover strategy
    data['SMA20'] = data['Close'].rolling(window=20).mean()
    data['SMA50'] = data['Close'].rolling(window=50).mean()
    
    data['Signal'] = 0
    data['Signal'][20:] = np.where(data['SMA20'][20:] > data['SMA50'][20:], 1, 0)
    data['Position'] = data['Signal'].diff()
    
    trades = []
    success_trades = 0
    total_trades = 0
    
    for index, row in data.iterrows():
        if row['Position'] == 1:
            trades.append({'Datetime': index, 'Type': 'Buy', 'Price': row['Close']})
        elif row['Position'] == -1:
            trades.append({'Datetime': index, 'Type': 'Sell', 'Price': row['Close']})
            total_trades += 1
            if trades[-2]['Price'] < row['Close']:
                success_trades += 1
    
    success_rate = (success_trades / total_trades ) * 100 if total_trades > 0 else 0
    return trades , success_rate

def rsi_strategy(data):
    # Define a simple RSI strategy
    delta = data['Close'].diff(1)
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    rs = avg_gain / avg_loss
    data['RSI'] = 100 - (100 / (1 + rs))

    data['Signal'] = 0
    data['Signal'][14:] = np.where(data['RSI'][14:] < 30, 1, 0) # Buy when RSI < 30
    data['Signal'][14:] = np.where(data['RSI'][14:] > 70, -1, data['Signal'][14:]) # Sell when RSI > 70
    data['Position'] = data['Signal'].diff()
    
    trades = []
    success_trades = 0
    total_trades = 0
    
    for index, row in data.iterrows():
        if row['Position'] == 1:
            trades.append({'Datetime': index, 'Type': 'Buy', 'Price': row['Close']})
        elif row['Position'] == -1:
            trades.append({'Datetime': index, 'Type': 'Sell', 'Price': row['Close']})
            total_trades +=1
            if trades[-2]['Price'] < row['Close']:
                success_trades +=1
    
    success_rate = (success_trades / total_trades) * 100 if total_trades > 0 else 0
    return trades, success_rate

def predict_stock(request):
    ticker = request.GET.get('ticker')
    period = request.GET.get('period')
    interval = request.GET.get('interval')

    if not ticker:
        return JsonResponse({'error': 'Ticker is required'}, status=400)

    try:
        scaler = train_model(ticker, period, interval)
        predicted_price = predict(ticker, scaler)
        return JsonResponse({'ticker': ticker, 'predicted_price': float(predicted_price)})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

pusher_client = pusher.Pusher(
  app_id='1816475',
  key='cb67c8ebd0ea59ee4a5e',
  secret='1ea8e7cb8e3edb296b57',
  cluster='eu',
  ssl=True
)

def send_price_alert(ticker, price, new_data):
    print(f"Sending price alert for {ticker} at {price}")
    pusher_client.trigger('price_alerts', 'price_alert', {'ticker': ticker, 'price': price})
    print(f"Sending news update: {new_data}")
    pusher_client.trigger('news_channel', 'news_channel', {'articles': new_data})
    

def stock_detail_view(request, ticker):
    stock = yf.Ticker(ticker)

    # קבלת נתוני מניות היסטוריים
    stock_data = stock.history(period="1mo")

    # קבלת נתוני מאזן, דוח רווח והפסד ותזרימי מזומנים
    balance_sheet = stock.balance_sheet
    financials = stock.financials
    cashflow = stock.cashflow

    def convert_df_to_dict(df):
        df = df.reset_index()  # Reset index to ensure it's part of the dataframe
        df = df.applymap(str)  # Convert all values in the dataframe to string
        return df.to_dict(orient='records')

    response_data = {
        'ticker': ticker,
        'stock_data': convert_df_to_dict(stock_data),
        'balance_sheet': convert_df_to_dict(balance_sheet),
        'financials': convert_df_to_dict(financials),
        'cashflow': convert_df_to_dict(cashflow),
    }

    return JsonResponse(response_data)


