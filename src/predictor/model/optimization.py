from hyperopt import fmin, tpe, hp, Trials
import modeling
from contextlib import redirect_stdout

def optimize(dir, X_train, y_train, X_test, y_test, arch, batch_size, loss_functions, start_neurons, max_neurons, learning_rate_start, dropout, epochs=5, attempts=10, ):
    # Define the search space for hyperparameters
    space = {
        "type": "optimization",
        'start_neurons': hp.quniform('start_neurons', start_neurons["min"], start_neurons["max"], start_neurons["step"]),
        'max_neurons': hp.quniform('max_neurons', max_neurons["min"], max_neurons["max"], max_neurons["step"]),
        'learning_rate': hp.loguniform('learning_rate', learning_rate_start, 0),  # Between 10^-(X) and 1
        'loss_function': hp.choice('loss_function', loss_functions),
        'dropout': hp.uniform('dropout', dropout["min"], dropout["max"]),
        'epochs': epochs,
        'dir':dir,
        'X_train': X_train, 
        'y_train': y_train, 
        'X_test': X_test,
        'y_test': y_test,
        'architecture': arch,
        'batch_size': batch_size
    }

    # Create Trials to store results
    trials = Trials()

    # Run the optimization
    best = fmin(fn=modeling.build, 
                space=space, 
                algo=tpe.suggest, 
                max_evals=attempts,  # Number of attempts
                trials=trials)
    
    best["loss_function"] = loss_functions[best["loss_function"]]
    print("------------*******----------------")
    print("Best Hyperparameters Found:", best)
    print("------------*******----------------")
    with open(f"{dir}/model-optimization-{arch}.txt", 'w') as f:
            with redirect_stdout(f):
                print("Best Hyperparameters Found:", best)
    return best
