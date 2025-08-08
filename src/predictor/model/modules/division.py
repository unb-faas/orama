from sklearn.model_selection import train_test_split

def divide(data, test_size=0.2):
    y = data['duration']
    X = data.drop(columns=['duration'], axis=1)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)

    print("........... X Train ............")
    print(X_train)
    print("........... Y Train ............")
    print(y_train)
    print("........... X Test ............")
    print(X_test) 
    print("........... Y Test ............")
    print(y_test) 
    return X_train, X_test, y_train, y_test

