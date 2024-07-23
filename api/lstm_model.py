import numpy as np
import pandas as pd
import yfinance as yf
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

def prepare_data(ticker, period, interval):
    df = yf.download(ticker, period=period, interval=interval)
    if df.empty:
        raise ValueError("No data fetched from yfinance.")
    df = df[['Close']]
    print(f"Data fetched for {ticker} with period {period} and interval {interval}: {df.shape}")

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(df)

    X_train, y_train = [], []
    for i in range(60, len(scaled_data)):
        X_train.append(scaled_data[i-60:i, 0])
        y_train.append(scaled_data[i, 0])
    
    X_train, y_train = np.array(X_train), np.array(y_train)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

    return X_train, y_train, scaler

def build_model():
    model = tf.keras.Sequential()
    model.add(tf.keras.layers.LSTM(units=50, return_sequences=True, input_shape=(60, 1)))
    model.add(tf.keras.layers.LSTM(units=50, return_sequences=False))
    model.add(tf.keras.layers.Dense(units=25))
    model.add(tf.keras.layers.Dense(units=1))

    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

def train_model(ticker, period, interval):
    X_train, y_train, scaler = prepare_data(ticker, period, interval)
    model = build_model()
    model.fit(X_train, y_train, batch_size=1, epochs=1)
    model.save(f'{ticker}_model.h5')
    return scaler

def predict(ticker, scaler):
    model = tf.keras.models.load_model(f'{ticker}_model.h5')
    df = yf.download(ticker, period='60d', interval='1d')
    if df.empty:
        raise ValueError("No data fetched from yfinance for prediction.")
    df = df[['Close']]

    last_60_days = df[-60:].values
    last_60_days_scaled = scaler.transform(last_60_days)

    X_test = []
    X_test.append(last_60_days_scaled)
    X_test = np.array(X_test)
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

    pred_price = model.predict(X_test)
    pred_price = scaler.inverse_transform(pred_price)

    return pred_price[0][0]
