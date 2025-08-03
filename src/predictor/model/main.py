try:
    import os
    from datetime import datetime
    import preprocessing
    import division
    import modeling
    import optimization
    import train
    import evaluation
    import joblib
    from contextlib import redirect_stdout
    from tensorflow.compat.v1 import ConfigProto
    from tensorflow.compat.v1 import InteractiveSession
    import sys
    import json

    #sys.setrecursionlimit(2000)

    #config = ConfigProto()
    #config.gpu_options.allow_growth = True
    #session = InteractiveSession(config=config)

    ## Force CPU usage
    #os.environ['CUDA_VISIBLE_DEVICES'] = '1'

    ## Config
    config = {
        "optimization_enabled": int(input("Do you want to use optimizator (0/1)? ")),
        "clean_duplicates": True,
        "remove_missing_values": True,
        "remove_spikes": True,
        "winsorize": False,
        "replace_outliers_with_median": False,
        "reduce_scale_pca": False,
        "cols_pca": [
            "total_operands", 
            "distinct_operands", 
            "total_operators", 
            "distinct_operators",
            "time", 
            "bugs", 
            "effort", 
            "volume", 
            #"difficulty", 
            #"vocabulary", 
            #"length"
        ],
        "normalize": True,
        "test_size": 0.25,
        "archs": ['Dense', 'LSTM', 'BLSTM'],
        "best_params": {
            'Dense':{   
                'learning_rate': 0.011310861746975967, 
                'loss_function': 'mean_squared_error', 
                'start_neurons': 16,
                'max_neurons': 32,
                "dropout": False,
            },
            'LSTM':{   
                'learning_rate': 0.021868258192468973, 
                'loss_function': 'mean_squared_error', 
                'start_neurons': 16,
                'max_neurons': 16,
                "dropout": False,
            },
            'BLSTM':{   
                'learning_rate': 0.012410865746975944, 
                'loss_function': 'mean_squared_error', 
                'start_neurons': 16,
                'max_neurons': 16,
                "dropout": False,
            }
        },
        "batch_size": 32,
        "optimization":{
            "loss_functions": ['mean_squared_error','mean_absolute_error','huber'],
            "start_neurons": {
                "min":8,
                "max":16,
                "step":8
            },
            "max_neurons": {
                "min":16,
                "max":64,
                "step":8
            },
            "learning_rate_start": -5,
            #"dropout": False,
            "dropout":{ 
                "min": 0.1,
                "max": 0.5
            }
        }
    }
    optimization_enabled = True if config["optimization_enabled"]==1 else False
    epoches_optimization = 5
    if optimization_enabled:
        config["optimization"]["epoches"] = int(input("Epoches in optimization: "))
        config["optimization"]["attempts"] = int(input("Attempts in optimization: "))
    config["epoches_training"] = int(input("Epoches in training: "))

    print("#####################################")
    print("#     Creates results structure     #")
    print("#####################################") 
    main_dir = "results"
    if not os.path.exists(main_dir):
        os.makedirs(main_dir)
        print(f"Dir '{main_dir}' created.")
    else:
        print(f"Dir '{main_dir}' exists.")
    timestamp = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}-opt_{optimization_enabled}-opt_ep_{epoches_optimization}-train_ep_{config['epoches_training']}"
    sub_dir = os.path.join(main_dir, timestamp)
    os.makedirs(sub_dir, exist_ok=True)
    print(f"Subdir '{sub_dir}' created.")
    with open(f"{sub_dir}/config.json", "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=4)

    print("----------------#####################################----------------")
    print("----------------#      Init - preprocessing         #----------------")
    print("----------------#####################################----------------")

    print("#####################################")
    print("#           Initial Dataset         #")
    print("#####################################")
    data = preprocessing.load_dataset('../dataset/outputs/dataset.csv')
    print(data)
    print(preprocessing.list_columns(data))

    print("#####################################")
    print("#    Removes irrelevant collumns     #")
    print("#####################################")
    data = preprocessing.remove_unused_collumns(data)
    print(data)
    
    print("#####################################")
    print("#             Categorize            #")
    print("#####################################")
    data, encoders = preprocessing.categorize(data)
    print(data)
    print(encoders)
    joblib.dump(encoders, f'{sub_dir}/encoders.pkl')

    if config["clean_duplicates"]:
        print("#####################################")
        print("#          Clean duplicates         #")
        print("#####################################")
        data = preprocessing.remove_duplicates(data)
        print(data)
    
    if config["remove_missing_values"]:
        print("#####################################")
        print("#        Remove Missing values      #")
        print("#####################################")
        data = preprocessing.check_and_remove_missing_values(data)
        print(data)
    
    if config["remove_spikes"]:
        print("#####################################")
        print("#        Remove Spikes with         #")
        print("#   WMA - Weighted Moving Average   #")
        print("#####################################")
        data = preprocessing.remove_spikes(data)
        print(data)
    
    if config["winsorize"]:
        print("#####################################")
        print("#          Winsorize                #")
        print("#####################################")
        data = preprocessing.winsorization(data)
        print(data)

    print("#####################################")
    print("#         Identify outliers         #")
    print("#####################################")
    preprocessing.identify_outliers(data)
    
    if config["winsorize"]:
        print("#####################################")
        print("#    Replace outliers with median   #")
        print("#####################################")
        data = preprocessing.replace_outliers_with_median(data)
        print(data)

    print("#####################################")
    print("#       Correlation Analysis        #")
    print("#####################################")
    preprocessing.correlation_analysis(data, sub_dir)

    if config["winsorize"]:
        print("#####################################")
        print("#     Reducing Scale with PCA       #")
        print("#####################################")
        data, pca, pca_scaler = preprocessing.reduce_scale_pca(data, config["cols_pca"])
        preprocessing.correlation_analysis(data, sub_dir, True, "reduced")
        joblib.dump(pca, f'{sub_dir}/pca.pkl')
        joblib.dump(pca_scaler, f'{sub_dir}/pca_scaler.pkl')
        data = preprocessing.remove_reduced_collumns(data, config["cols_pca"])
        preprocessing.correlation_analysis(data, sub_dir, True, "reduced_cleaned")

    if config["normalize"]:
        print("#####################################")
        print("#       Normalize with z-score      #")
        print("#####################################")
        data, scaler = preprocessing.normalize(data)
        print(data)
        joblib.dump(scaler, f'{sub_dir}/scaler.pkl')

    print("----------------#####################################----------------")
    print("----------------#      Preprocessing finished       #----------------")
    print("----------------#####################################----------------")

    print("----------------#####################################----------------")
    print("----------------#          Init - division          #----------------")
    print("----------------#####################################----------------")
    X_train, X_test, y_train, y_test = division.divide(data, config["test_size"])
    print("----------------#####################################----------------")
    print("----------------#          Division finished        #----------------")
    print("----------------#####################################----------------")

    arch_result = {}
    for arch in config["archs"]:

        print("----------------#####################################----------------")
        print(f"----------------#           Init - {arch}        #----------------")
        print("----------------#####################################----------------")

        if optimization_enabled == True:
            print("----------------#####################################----------------")
            print("----------------#        Init - Optimization        #----------------")
            print("----------------#####################################----------------")
            config["best_params"][arch] = optimization.optimize(sub_dir, X_train, y_train, X_test, y_test, arch, config["batch_size"], loss_functions=config["optimization"]["loss_functions"], start_neurons=config["optimization"]["start_neurons"], max_neurons=config["optimization"]["max_neurons"], learning_rate_start=config["optimization"]["learning_rate_start"], dropout=config["optimization"]["dropout"], epochs=config["optimization"]["epoches"], attempts=config["optimization"]["attempts"])
            print("----------------#####################################----------------")
            print("----------------#       Optimization finished       #----------------")
            print("----------------#####################################----------------")

        print("----------------#####################################----------------")
        print("----------------#          Init - Modeling          #----------------")
        print("----------------#####################################----------------")
        params = config["best_params"][arch]
        params['X_train'] = X_train
        params['y_train'] = y_train
        params['X_test'] = X_test
        params['y_test'] = y_test
        params['dir'] = sub_dir
        params['type'] = "train"
        params['epochs'] = config["epoches_training"]
        params['architecture'] = arch
        params['batch_size'] = config["batch_size"]
        
        model = modeling.build(params)
        print("----------------#####################################----------------")
        print("----------------#          Modeling finished        #----------------")
        print("----------------#####################################----------------")

        print("----------------#####################################----------------")
        print("----------------#          Init - Training          #----------------")
        print("----------------#####################################----------------")
        train_results, model = train.fit(sub_dir, X_train, y_train, X_test, y_test, model, arch, config["batch_size"], int(params['epochs']))
        print("----------------#####################################----------------")
        print("----------------#          Training finished        #----------------")
        print("----------------#####################################----------------")

        arch_result[arch] = {
                "params": params, 
                "model": model,
                "train_results": train_results,
                "X_test":X_test,
                "y_test": y_test,
                "scaler": scaler, 
                "encoders": encoders
        }

        print("----------------#####################################----------------")
        print("----------------#         Init - Evaluation         #----------------")
        print("----------------#####################################----------------")
        evaluation.evaluate({arch:arch_result[arch]}, X_test, y_test, scaler, encoders, arch, sub_dir)
        print("----------------#####################################----------------")
        print("----------------#         Evaluation finished       #----------------")
        print("----------------#####################################----------------")     

        with open(f"{sub_dir}/results_{arch}.txt", 'w') as f:
            with redirect_stdout(f):
                print(f"{arch} results:", arch_result[arch])

        print("----------------#####################################----------------")
        print(f"----------------#         {arch} - finished      #----------------")
        print("----------------#####################################----------------")

    with open(f"{sub_dir}/results_consolidated.txt", 'w') as f:
            with redirect_stdout(f):
                print(f"Results:", arch_result)

    print("----------------##################################################----------------")
    print("----------------#         Init - Consolidated Evaluation         #----------------")
    print("----------------##################################################----------------")
    evaluation.evaluate(arch_result, X_test, y_test, scaler, encoders, arch, sub_dir)
    print("----------------##################################################----------------")
    print("----------------#         Consolidated Evaluation finished       #----------------")
    print("----------------##################################################----------------") 
    
    print("----------------#####################################----------------")
    print(f"----------------#           All finished            #----------------")
    print("----------------#####################################----------------")

except Exception as e:
    print(f"Erro: {e}")