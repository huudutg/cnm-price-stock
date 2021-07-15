import os

from models.lstm import Lstm
from models.rnn import Rnn
from utils.utilities import get_data, preprocess
from models.xgb import Xgb


def load():
    if not os.path.isdir('save_model'):
        os.makedirs('save_model')

    files = os.listdir('save_model')

    models = {
        'lstm_close': Lstm(
            path='save_model/lstm_close.h5',
            features=['Close'],
            epochs=100),
        'lstm_close_poc': Lstm(
            path='save_model/lstm_close_poc.h5',
            features=['Close', 'poc'],
            epochs=10),
        'lstm_close_rsi': Lstm(
            path='save_model/lstm_close_rsi.h5',
            features=['Close', 'rsi'],
            epochs=10),
        'lstm_close_bb': Lstm(
            path='save_model/lstm_close_bb.h5',
            features=['Close', 'bb'],
            epochs=10),
        'lstm_close_poc_rsi': Lstm(
            path='save_model/lstm_close_poc_rsi.h5',
            features=['Close', 'poc', 'rsi'],
            epochs=15),
        'lstm_close_poc_bb': Lstm(
            path='save_model/lstm_close_poc_bb.h5',
            features=['Close', 'poc', 'bb'],
            epochs=15),
        'lstm_close_rsi_bb': Lstm(
            path='save_model/lstm_close_rsi_bb.h5',
            features=['Close', 'rsi', 'bb'],
            epochs=15),
        'lstm_close_poc_rsi_bb': Lstm(
            path='save_model/lstm_close_poc_rsi_bb.h5',
            features=['Close', 'poc', 'rsi', 'bb'],
            epochs=15),
        'rnn_close': Rnn(
            path='save_model/rnn_close.h5',
            features=['Close'],
            epochs=64),
        'rnn_close_poc': Rnn(
            path='save_model/rnn_close_poc.h5',
            features=['Close', 'poc'],
            epochs=10),
        'rnn_close_rsi': Rnn(
            path='save_model/rnn_close_rsi.h5',
            features=['Close', 'rsi'],
            epochs=10),
        'rnn_close_bb': Rnn(
            path='save_model/rnn_close_bb.h5',
            features=['Close', 'bb'],
            epochs=10),
        'rnn_close_poc_rsi': Rnn(
            path='save_model/rnn_close_poc_rsi.h5',
            features=['Close', 'poc', 'rsi'],
            epochs=10),
        'rnn_close_poc_bb': Rnn(
            path='save_model/rnn_close_poc_bb.h5',
            features=['Close', 'poc', 'bb'],
            epochs=10),
        'rnn_close_rsi_bb': Rnn(
            path='save_model/rnn_close_rsi_bb.h5',
            features=['Close', 'rsi', 'bb'],
            epochs=10),
        'rnn_close_poc_rsi_bb': Rnn(
            path='save_model/rnn_close_poc_rsi_bb.h5',
            features=['Close', 'poc', 'rsi', 'bb'],
            epochs=10),
        'xgb_close': Xgb('save_model/xgb_close.h5', ['Close']),
        'xgb_close_poc': Xgb('save_model/xgb_close_poc.h5', ['Close', 'poc']),
        'xgb_close_rsi': Xgb('save_model/xgb_close_rsi.h5', ['Close', 'rsi']),
        'xgb_close_bb': Xgb('save_model/xgb_close_bb.h5', ['Close', 'bb']),
        'xgb_close_poc_rsi': Xgb('save_model/xgb_close_poc_rsi.h5', ['Close', 'poc', 'rsi']),
        'xgb_close_poc_bb': Xgb('save_model/xgb_close_poc_bb.h5', ['Close', 'poc', 'bb']),
        'xgb_close_rsi_bb': Xgb('save_model/xgb_close_rsi_bb.h5', ['Close', 'bb', 'rsi']),
        'xgb_close_poc_rsi_bb': Xgb('save_model/xgb_close_poc_rsi_bb.h5', ['Close', 'poc', 'bb', 'rsi'])

    }

    stocks = ['aapl']

    for stock in stocks:
        df = get_data(stock, start='2010-01-01', end='2021-01-01')
        for model in models:
            _, X, Y = preprocess(df, models[model].features, models[model].n_days)

            if not models[model].path.split('/')[-1] in files:
                models[model].fit(X[:-1], Y)

            models[model].predict(X[:models[model].n_days])

    return models
