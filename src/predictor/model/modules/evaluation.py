from sklearn.metrics import mean_absolute_percentage_error, mean_absolute_error, mean_squared_error, r2_score, mean_squared_error, mean_absolute_percentage_error
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import seaborn as sns
from sklearn.model_selection import KFold
import random
from contextlib import redirect_stdout

def calculate_metrics(models, X_test, y_test, dir):
    # Assume X_test and y_test are the same for all models
    X_test_r2 = np.asarray(X_test)
    y_test_r2 = np.squeeze(np.asarray(y_test))
    results = {}
    for i, (arch, model) in enumerate(models.items()):
        kf = KFold(n_splits=10, shuffle=True, random_state=42)
        r2_values = []
        rmse_values = []
        mse_values = []
        mape_values = []
        mape2_values = []
        mae_values = []
        observations = []
        predictions = []

        # Perform 10-fold evaluation on the test set
        for train_index, test_index in kf.split(X_test_r2):
            X_fold = X_test_r2[test_index]
            y_fold = y_test_r2[test_index]
            y_pred_fold = model["model"].predict(X_fold)
            y_pred_fold = np.squeeze(y_pred_fold)
            r2 = r2_score(y_fold, y_pred_fold)
            r2_values.append(r2)
            rmse = np.sqrt(np.mean((y_fold - y_pred_fold) ** 2))
            rmse_values.append(rmse)
            mse = np.mean((y_fold - y_pred_fold) ** 2)
            mse_values.append(mse)
            mape = mean_absolute_percentage_error(y_fold, y_pred_fold)
            mape_values.append(mape)
            mask = y_fold != 0
            mape2 = np.mean(np.abs((y_fold[mask] - y_pred_fold[mask]) / y_fold[mask])) * 100
            mape2_values.append(mape2)
            mae = np.mean(np.abs(y_fold - y_pred_fold))
            mae_values.append(mae)
        
        observations.append(y_test)
        predictions.append(model["model"].predict(X_test))
                
        results[arch] = {
            "r2": r2_values,
            "rmse": rmse_values,
            "mse": mse_values,
            "mape": mape_values,
            "mape2": mape2_values,
            "mae": mae_values,
            "observations": observations,
            "predictions": predictions,
        }

    metric_names = ["r2", "rmse", "mse", "mape", "mape2", "mae"]
    with open(f"{dir}/models-evaluation-metrics.txt", 'w') as f:
        for metric in metric_names:
            f.write(f"{metric.upper()}\n")
            headers = "\t" + "\t".join(results.keys()) + "\n"
            f.write(headers)
            for i in range(10):
                row = f"R{i+1}"
                for model_name in results:
                    val = results[model_name][metric][i]
                    row += f"\t{val:.4f}"
                f.write(row + "\n")
            f.write("\n")
    return results

def plot_metric_boxplot(metrics, name, label, color, dir):
    plt.clf()
    fig, axes = plt.subplots(1, len(metrics), figsize=(6*len(metrics), 5), sharey=True)
    str_arch = ""
    if len(metrics)==1:
        axes = [axes]
    for i, arch in enumerate(metrics):
        values = metrics[arch][name]
        str_arch = f"{str_arch}_{arch}"
        sns.boxplot(y=values, color=color, ax=axes[i])
        axes[i].set_title(arch)
        axes[i].set_ylabel(label if i == 0 else "")  # Only show label on the first plot
    # Adjust layout and save figure
    plt.suptitle(f"{name.upper()} Boxplot", fontsize=16)
    plt.tight_layout()
    plt.savefig(f"{dir}/graph-{name}-boxplot-{str_arch}.png")
    plt.close()

def plot_loss(models, dir):
    plt.clf()
    fig, axes = plt.subplots(1, len(models), figsize=(10*len(models), 5), sharey=True)
    str_arch = ""
    if len(models)==1:
        axes = [axes]
    for i, (arch, model) in enumerate(models.items()):
        str_arch = f"{str_arch}_{arch}"
        ax = axes[i]
        ax.plot(model["train_results"].history['loss'], label='Training Loss')
        ax.plot(model["train_results"].history['val_loss'], label='Validation Loss')
        ax.set_title(f"{arch}")
        ax.set_xlabel("Epochs")
        if i == 0:
            ax.set_ylabel("Loss")
        ax.legend()

    # Set a common title
    fig.suptitle("Training and Validation Loss", fontsize=16)
    plt.tight_layout(rect=[0, 0, 1, 0.95])  # leave space for the suptitle
    plt.savefig(f"{dir}/graph-loss-{str_arch}.png")
    plt.close()

def plot_obs_preds(metrics, dir):
    plt.clf()
    fig, axes = plt.subplots(len(metrics), 1, figsize=(10, 5 * len(metrics)), sharex=True)
    str_arch = ""

    # Ensure axes is always iterable
    if len(metrics) == 1:
        axes = [axes]

    for i, (arch, model) in enumerate(metrics.items()):
        str_arch += f"_{arch}"
        ax = axes[i]
        observations = np.squeeze(model["observations"])
        predictions = np.squeeze(model["predictions"])
        ax.plot(range(len(observations)), observations, label='Observations', color='blue', marker='o')
        ax.plot(range(len(predictions)), predictions, label='Predictions', color='orange', marker='x')
        ax.set_xlim(150, 200)
        ax.set_title(f"{arch}", fontsize=14)
        ax.set_ylabel('Value', fontsize=12)
        if i == len(metrics) - 1:
            ax.set_xlabel('Time / Data Point', fontsize=12)
        ax.legend()

    # Add a common title and adjust layout
    fig.suptitle("Observations vs Predictions", fontsize=16)
    plt.tight_layout(rect=[0, 0, 1, 0.95])
    plt.savefig(f"{dir}/graph-obs-preds-{str_arch}.png")
    plt.close()

def plot_overview(metrics, dir):
    for i, (arch, model) in enumerate(metrics.items()): 
        observations = np.reshape(model["observations"],-1)
        predictions = np.reshape(model["predictions"],-1)
        print(f"Metrics for {arch}")
        mae = mean_absolute_error(observations, predictions)
        print(f"{arch} MAE: {mae}")
        mape = mean_absolute_percentage_error(observations, predictions)
        print(f"{arch} MAPE: {mape}")
        print(f"{arch} MAPE: {mape * 100:.2f}%") 
        mse = mean_squared_error(observations, predictions)
        print(f"{arch} MSE: {mse}")
        rmse = np.sqrt(mse)
        print(f"{arch} RMSE: {rmse}")
        r2 = r2_score(observations, predictions)
        print(f'{arch} R^2 Score: {r2}')
        evaluation = {
            "mae": mae,
            "mape": mape,
            "mse": mse,
            "rmse": rmse,
            "r2": r2
        }
        with open(f"{dir}/model-evaluation-{arch}.txt", 'w') as f:
            with redirect_stdout(f):
                print(evaluation)

def evaluate(results, X_test, y_test, scaler, encoders, arch, dir, plot=True, test=False):
    if isinstance(results, dict):
        metrics = calculate_metrics(results, X_test, y_test, dir)
        plot_metric_boxplot(metrics, "r2", "R²", "#%06x" % random.randint(0, 0xFFFFFF), dir)
        plot_metric_boxplot(metrics, "rmse", "RMSE", "#%06x" % random.randint(0, 0xFFFFFF), dir)
        plot_metric_boxplot(metrics, "mse", "MSE", "#%06x" % random.randint(0, 0xFFFFFF), dir)
        plot_metric_boxplot(metrics, "mape2", "MAPE", "#%06x" % random.randint(0, 0xFFFFFF), dir)
        plot_metric_boxplot(metrics, "mae", "MAE", "#%06x" % random.randint(0, 0xFFFFFF), dir)
        plot_obs_preds(metrics, dir)
        plot_loss(results, dir)
        plot_overview(metrics, dir)
    else:
        raise ValueError(f"Results format unknown")
