class Method:
    def __init__(self, path, size=1, epochs=5):
        self.path = path
        self.epochs = epochs

        if os.path.isfile(path):
            self.model = load_model(path)
        else:
            self.model = Sequential()
            self.model.add(LSTM(32, input_shape=(1, size), return_sequences=True))
            self.model.add(LSTM(16))
            self.model.add(Dense(1))
            self.model.add(Activation('linear'))
            self.model.compile(loss='mean_squared_error', optimizer='adagrad')