import joblib

def fit(dir, X_train, y_train, X_test, y_test, model, arch, batch_size=16, epochs=50):
    train_results = model.fit(X_train, 
                              y_train, 
                              epochs=epochs, 
                              batch_size=batch_size, 
                              verbose=1, 
                              validation_data=(X_test, y_test),
                            )
    model.save(f'{dir}/model_{arch}.keras')
    feature_order = X_train.columns.tolist()
    joblib.dump(feature_order, f'{dir}/feature_order.pkl')
    return train_results, model