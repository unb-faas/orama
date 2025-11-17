import os
import json
import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_percentage_error, mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import KFold

# =====================================
# SAVE MODE FUNCTIONS
# =====================================

def calculate_metrics_and_save(models, X_test, y_test, dir, arch):
    """
    Perform K-Fold evaluation for each model, calculate metrics, 
    and save them to a JSON file for later use in plotting.
    """
    X_test_r2 = np.asarray(X_test)
    y_test_r2 = np.squeeze(np.asarray(y_test))
    results = {}

    for model_arch, model in models.items():
        kf = KFold(n_splits=10, shuffle=True, random_state=42)
        r2_values, rmse_values, mse_values = [], [], []
        mape_values, mape2_values, mae_values = [], [], []
        observations, predictions = [], []

        for _, test_index in kf.split(X_test_r2):
            X_fold = X_test_r2[test_index]
            y_fold = y_test_r2[test_index]
            y_pred_fold = np.squeeze(model["model"].predict(X_fold))

            r2_values.append(r2_score(y_fold, y_pred_fold))
            rmse_values.append(np.sqrt(np.mean((y_fold - y_pred_fold) ** 2)))
            mse_values.append(np.mean((y_fold - y_pred_fold) ** 2))
            mape_values.append(mean_absolute_percentage_error(y_fold, y_pred_fold))

            mask = y_fold != 0
            mape2_values.append(np.mean(np.abs((y_fold[mask] - y_pred_fold[mask]) / y_fold[mask])) * 100)
            mae_values.append(np.mean(np.abs(y_fold - y_pred_fold)))

        observations.append(y_test_r2.tolist())
        predictions.append(np.squeeze(model["model"].predict(X_test_r2)).tolist())

        results[model_arch] = {
            "r2": r2_values,
            "rmse": rmse_values,
            "mse": mse_values,
            "mape": mape_values,
            "mape2": mape2_values,
            "mae": mae_values,
            "observations": observations,
            "predictions": predictions,
        }

    os.makedirs(dir, exist_ok=True)
    with open(f"{dir}/metrics_data_{arch}.json", "w") as f:
        json.dump(results, f, indent=4)

    return results


def save_loss_data(models, dir, arch):
    """
    Save loss curves (training and validation) for each model to JSON.
    """
    loss_data = {}
    for model_arch, model in models.items():
        loss_data[model_arch] = {
            "loss": list(map(float, model["train_results"].history['loss'])),
            "val_loss": list(map(float, model["train_results"].history['val_loss']))
        }
    with open(f"{dir}/loss_data_{arch}.json", "w") as f:
        json.dump(loss_data, f, indent=4)


def save_overview_data(metrics, dir, arch):
    """
    Calculate overall metrics for full test set and save to JSON.
    """
    overview = {}
    for model_arch, model in metrics.items():
        observations = np.reshape(model["observations"], -1)
        predictions = np.reshape(model["predictions"], -1)

        mae = mean_absolute_error(observations, predictions)
        mape = mean_absolute_percentage_error(observations, predictions)
        mse = mean_squared_error(observations, predictions)
        rmse = np.sqrt(mse)
        r2 = r2_score(observations, predictions)

        overview[model_arch] = {
            "mae": mae,
            "mape": mape,
            "mse": mse,
            "rmse": rmse,
            "r2": r2
        }

    with open(f"{dir}/overview_data_{arch}.json", "w") as f:
        json.dump(overview, f, indent=4)

# =====================================
# PLOT MODE FUNCTIONS (load from file)
# =====================================

def plot_metric_boxplot_from_file(name, label, color, dir, arch):
    """
    Load metric values from JSON and generate boxplots for each model.
    """
    with open(f"{dir}/metrics_data_{arch}.json", "r") as f:
        metrics = json.load(f)

    plt.clf()
    fig, axes = plt.subplots(1, len(metrics), figsize=(6*len(metrics), 5), sharey=True)
    if len(metrics) == 1:
        axes = [axes]

    for i, model_arch in enumerate(metrics):
        values = metrics[model_arch][name]
        sns.boxplot(y=values, color=color, ax=axes[i])
        axes[i].set_title(model_arch, fontsize=16)
        axes[i].set_ylabel(label if i == 0 else "", fontsize=16)
        axes[i].tick_params(axis='both', labelsize=14)

    plt.suptitle(f"{name.upper()} Boxplot", fontsize=16)
    plt.tight_layout()
    plt.savefig(f"{dir}/graph-{name}-boxplot-{arch}.png")
    plt.close()


def plot_loss_from_file(dir, arch):
    """
    Load loss curves from JSON and plot training vs validation loss.
    """
    with open(f"{dir}/loss_data_{arch}.json", "r") as f:
        loss_data = json.load(f)

    plt.clf()
    fig, axes = plt.subplots(1, len(loss_data), figsize=(10*len(loss_data), 5), sharey=True)
    if len(loss_data) == 1:
        axes = [axes]

    for i, (model_arch, data) in enumerate(loss_data.items()):
        axes[i].plot(data["loss"], label='Training Loss')
        axes[i].plot(data["val_loss"], label='Validation Loss')
        axes[i].set_title(model_arch, fontsize=16)
        axes[i].set_xlabel("Epochs", fontsize=16)
        if i == 0:
            axes[i].set_ylabel("Loss", fontsize=16)
        axes[i].legend(fontsize=16)
        axes[i].tick_params(axis='both', labelsize=14)
    fig.suptitle("Training and Validation Loss", fontsize=16)
    plt.tight_layout(rect=[0, 0, 1, 0.95])
    plt.savefig(f"{dir}/graph-loss-{arch}.png")
    plt.close()


def plot_obs_preds_from_file(dir, arch):
    """
    Load observations and predictions from JSON and plot them.
    """
    start, end = 400, 450

    with open(f"{dir}/metrics_data_{arch}.json", "r") as f:
        metrics = json.load(f)

    plt.clf()
    fig, axes = plt.subplots(len(metrics), 1, figsize=(10, 5 * len(metrics)), sharex=True)
    if len(metrics) == 1:
        axes = [axes]

    for i, (model_arch, model) in enumerate(metrics.items()):
        observations = np.squeeze(model["observations"])[start:end]
        predictions = np.squeeze(model["predictions"])[start:end]
        x = range(start, end)
        axes[i].plot(x, observations, label='Observations', color='gray', marker='o')
        axes[i].plot(x, predictions, label='Predictions', color='orange', marker='x')
        axes[i].set_title(f"{model_arch}", fontsize=16)
        axes[i].set_ylabel('Value', fontsize=16)
        if i == len(metrics) - 1:
            axes[i].set_xlabel('Time / Data Point', fontsize=16)
        axes[i].legend(fontsize=16)



    fig.suptitle("Observations vs Predictions", fontsize=16)
    plt.tight_layout(rect=[0, 0, 1, 0.95])
    plt.savefig(f"{dir}/graph-obs-preds-{arch}.png")
    plt.close()


def plot_overview_from_file(dir, arch):
    """
    Load overall evaluation metrics and print them in console.
    """
    with open(f"{dir}/overview_data_{arch}.json", "r") as f:
        overview = json.load(f)

    for model_arch, data in overview.items():
        print(f"Metrics for {model_arch}")
        for k, v in data.items():
            print(f"{k.upper()}: {v}")

def plot_critical_difference(dir, arch, metric="rmse", alpha=0.05):
    """
    Generate a Critical Difference Diagram (Demšar 2006 style) for a given metric.
    """
    import numpy as np
    import json
    from scipy.stats import rankdata
    import matplotlib.pyplot as plt

    # q_alpha table for alpha=0.05 (Demšar 2006)
    # Values taken from critical values of the Studentized Range Statistic
    q_alpha_05 = {
        2: 1.960, 3: 2.343, 4: 2.569, 5: 2.728,
        6: 2.850, 7: 2.949, 8: 3.031, 9: 3.102, 10: 3.164
    }

    # Load saved metrics from JSON
    with open(f"{dir}/metrics_data_{arch}.json", "r") as f:
        metrics = json.load(f)

    model_names = list(metrics.keys())
    k = len(model_names)  # Number of models
    
    # Extract metric values for each model
    all_values = []
    for m in model_names:
        all_values.append(metrics[m][metric])
    all_values = np.array(all_values).T  # Shape: (N, k) where N = folds/datasets
    N = all_values.shape[0]

    # Compute per-fold rankings (lower metric value => better rank)
    ranks = []
    for row in all_values:
        ranks.append(rankdata(row, method='average'))
    ranks = np.array(ranks)

    # Compute mean rank for each model
    mean_ranks = np.mean(ranks, axis=0)

    # Compute Critical Difference (CD) value
    q = q_alpha_05[k] if k in q_alpha_05 else q_alpha_05[max(q_alpha_05.keys())]
    cd = q * np.sqrt(k * (k + 1) / (6.0 * N))

    # Plot the diagram
    plt.figure(figsize=(8, 2))
    plt.axhline(0.5, color='black')

    # Draw model points and names
    for i, rank in enumerate(mean_ranks):
        plt.plot(rank, 0.5, 'o', markersize=8, label=model_names[i])
        plt.text(rank, 0.65, model_names[i], rotation=25, va='bottom', ha='center', fontweight='bold')

    # Draw the CD bar
    min_rank = np.min(mean_ranks)
    plt.plot([min_rank, min_rank + cd], [0.3, 0.3], color='black', lw=2)
    plt.text(min_rank + cd / 2, 0.2, f"CD = {cd:.2f}", ha='center')

    # Adjust axes and labels
    plt.xlim(0.5, k + 0.5)
    plt.ylim(0, 1)
    plt.xlabel("Mean Rank (lower is better)")
    plt.yticks([])
    plt.title(f"Critical Difference Diagram ({metric.upper()})")
    plt.tight_layout()

    # Save figure
    plt.savefig(f"{dir}/graph-critical-diff-{metric}-{arch}.png")
    plt.close()

    print(f"[OK] Critical Difference Diagram saved at: {dir}/graph-critical-diff-{metric}-{arch}.png")

# =====================================
# MASTER FUNCTION
# =====================================

def evaluate(results, X_test, y_test, scaler, encoders, arch, dir):
    metrics = calculate_metrics_and_save(results, X_test, y_test, dir, arch)
    save_loss_data(results, dir, arch)
    save_overview_data(metrics, dir, arch)
    plot_metric_boxplot_from_file("r2", "R²", "#%06x" % random.randint(0, 0xFFFFFF), dir, arch)
    plot_metric_boxplot_from_file("rmse", "RMSE", "#%06x" % random.randint(0, 0xFFFFFF), dir, arch)
    plot_metric_boxplot_from_file("mse", "MSE", "#%06x" % random.randint(0, 0xFFFFFF), dir, arch)
    plot_metric_boxplot_from_file("mape2", "MAPE", "#%06x" % random.randint(0, 0xFFFFFF), dir, arch)
    plot_metric_boxplot_from_file("mae", "MAE", "#%06x" % random.randint(0, 0xFFFFFF), dir, arch)
    plot_obs_preds_from_file(dir, arch)
    plot_loss_from_file(dir, arch)
    plot_overview_from_file(dir, arch)
    plot_critical_difference(dir, arch, metric="r2")
    plot_critical_difference(dir, arch, metric="rmse")
    plot_critical_difference(dir, arch, metric="mse")
    plot_critical_difference(dir, arch, metric="mape2")
    plot_critical_difference(dir, arch, metric="mae")
    
    