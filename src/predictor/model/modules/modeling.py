from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Dropout, LSTM, Bidirectional, Input
from contextlib import redirect_stdout
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.metrics import RootMeanSquaredError, MeanSquaredError, MeanAbsoluteError
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping
import numpy as np

def build(params):
    model_type = params["type"]
    architecture = params.get("architecture", "dense")  # default 'dense'
    learning_rate = params['learning_rate']
    loss_function = params['loss_function']
    dropout = params['dropout']
    epochs = params['epochs']
    dir = params['dir']
    X_train = params['X_train']
    y_train = params['y_train']
    X_test = params['X_test']
    y_test = params['y_test']
    batch_size = params['batch_size']
    start_neurons = int(params['start_neurons'])
    max_neurons = int(params['max_neurons'])
    
    print("-----------------")
    print("learning_rate: ", learning_rate)
    print("loss_function: ", loss_function)
    print("start_neurons: ", start_neurons)
    print("max_neurons: ", max_neurons)
    print("-----------------")
    
    model = keras.Sequential()
    
    if architecture == "Dense":
        model.add(Input(shape=(X_train.shape[1],)))
        neurons = start_neurons
        while neurons < max_neurons:
            model.add(Dense(neurons, activation='relu', kernel_regularizer=l2(0.01)))
            if dropout:
                model.add(Dropout(dropout))
            neurons *= 2

        while neurons >= start_neurons:
            model.add(Dense(neurons, activation='relu', kernel_regularizer=l2(0.01)))
            if dropout:
                model.add(Dropout(dropout))
            neurons //= 2
        model.add(Dense(1, activation='linear'))
        validation_data=(X_test, y_test)

    
    elif architecture in ["LSTM", "BLSTM"]:
        if len(X_train.shape) == 2:
            X_train = np.array(X_train)[..., None]
            X_test = np.array(X_test)[..., None]

        model.add(Input(shape=(X_train.shape[1], X_train.shape[2])))

        neurons = start_neurons
        while neurons < max_neurons:
            lstm_layer = LSTM(neurons, return_sequences=True, kernel_regularizer=l2(0.01))
            if architecture == "BLSTM":
                model.add(Bidirectional(lstm_layer))
            else:
                model.add(lstm_layer)
            if dropout:
                 model.add(Dropout(dropout))
            neurons *= 2

        while neurons >= start_neurons:
            return_seq = neurons > start_neurons
            lstm_layer = LSTM(neurons, return_sequences=return_seq, kernel_regularizer=l2(0.01))
            if architecture == "BLSTM":
                model.add(Bidirectional(lstm_layer))
            else:
                model.add(lstm_layer)
            if dropout:
                model.add(Dropout(dropout))
            neurons //= 2

        model.add(Dense(1, activation='linear'))
        validation_data = (X_test, y_test)

    else:
        raise ValueError(f"Architecture unknown: {architecture}")

    model.compile(optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
                  loss=loss_function,
                  metrics=[MeanAbsoluteError(), MeanSquaredError(), RootMeanSquaredError()])

    if model_type == "optimization":
        model.summary()
        early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
        history = model.fit(X_train,
                            y_train,
                            epochs=epochs,
                            batch_size=batch_size,
                            verbose=0,
                            validation_data=validation_data,
                            callbacks=[early_stop])
        val_loss = history.history['val_loss'][-1]
        return val_loss
    else:
        model.summary()
        with open(f"{dir}/model-summary-{architecture}.txt", 'w') as f:
            with redirect_stdout(f):
                model.summary()
        return model
