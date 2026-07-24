import os
import json
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import rankdata
from matplotlib.ticker import FormatStrFormatter

# ================================
# INPUTS
# ================================
BASE_DIR = input("Enter the base directory containing the JSON metric files: ").strip()
PREFIX = input("Enter the filename prefix (e.g., halstead): ").strip()
COLOR = input("Enter the color (e.g., blue, orange, gree): ").strip()

if not PREFIX:
    raise ValueError("Prefix must not be empty.")

if not os.path.isdir(BASE_DIR):
    raise FileNotFoundError(f"Directory not found: {BASE_DIR}")

GRAPH_DIR = os.path.join(BASE_DIR, "graphs")
os.makedirs(GRAPH_DIR, exist_ok=True)

START, END = 400, 450


# ================================
# UTILS
# ================================
def load_json(path):
    with open(path, "r") as f:
        return json.load(f)


def get_arch_name(filename):
    return filename.replace("metrics_data_", "").replace(".json", "")


def graph_filename(kind, metric, arch):
    """
    Generates standardized graph filenames.
    Example:
    halstead-graph-mae-boxplot-all.png
    """
    parts = [PREFIX, "graph"]
    if metric:
        parts.append(metric)
    parts.append(kind)
    parts.append(arch)
    return "-".join(parts) + ".png"


# ================================
# BOXPLOTS
# ================================
def plot_metric_boxplot(metrics, metric, ylabel, arch):
    ymin = 0.0
    ymax = 1.0 

    fig, axes = plt.subplots(
        1,
        len(metrics),
        figsize=(6 * len(metrics), 5),
        sharey=True,
        constrained_layout=True
    )

    for ax in axes:
        ax.set_ylim(ymin, ymax)    

    fig.suptitle(" ", fontsize=22)

    if len(metrics) == 1:
        axes = [axes]

    for i, (model, data) in enumerate(metrics.items()):
        sns.boxplot(y=data[metric], color=COLOR, ax=axes[i])
        axes[i].set_title(model, fontsize=22)
        axes[i].set_ylabel(ylabel if i == 0 else "", fontsize=22)
        axes[i].tick_params(axis='both', labelsize=22)
        axes[i].yaxis.set_major_formatter(FormatStrFormatter('%.3f'))

    #axes[0].set_title(f"{metric.upper()} Boxplot\n{axes[0].get_title()}",
    #                  fontsize=16, loc="left")


    fig.savefig(
        os.path.join(
            GRAPH_DIR,
            graph_filename("boxplot", metric, arch)
        ),
        dpi=300
    )
    plt.close(fig)


# ================================
# LOSS CURVES
# ================================
def plot_loss(loss_data, arch):
    fig, axes = plt.subplots(
        1,
        len(loss_data),
        figsize=(8 * len(loss_data), 4),
        sharey=True,
        constrained_layout=True
    )

    if len(loss_data) == 1:
        axes = [axes]

    for i, (model, data) in enumerate(loss_data.items()):
        axes[i].plot(data["loss"], label="Training Loss")
        axes[i].plot(data["val_loss"], label="Validation Loss")
        axes[i].set_title(model)
        axes[i].set_xlabel("Epochs")
        axes[i].set_ylabel("Loss" if i == 0 else "")
        axes[i].legend()

    fig.savefig(
        os.path.join(
            GRAPH_DIR,
            graph_filename("loss", None, arch)
        ),
        dpi=300
    )
    plt.close(fig)


# ================================
# OBSERVATIONS vs PREDICTIONS
# ================================
def plot_obs_preds(metrics, arch):
    fig, axes = plt.subplots(
        len(metrics),
        1,
        figsize=(10, 4 * len(metrics)),
        sharex=True,
        constrained_layout=True
    )


    if len(metrics) == 1:
        axes = [axes]

    for i, (model, data) in enumerate(metrics.items()):
        observations = np.squeeze(data["observations"])[START:END]
        predictions = np.squeeze(data["predictions"])[START:END]

        x = range(START, END)
        axes[i].plot(x, observations, label="Observations", marker="o")
        axes[i].plot(x, predictions, label="Predictions", marker="x")
        axes[i].set_title(model, fontsize=22)
        axes[i].set_ylabel("Value", fontsize=22)
        axes[i].legend(fontsize=18)

        if i == len(metrics) - 1:
            axes[i].set_xlabel('Time / Data Point', fontsize=22)

        axes[i].tick_params(axis='y', labelsize=22)
        
    fig.savefig(
        os.path.join(
            GRAPH_DIR,
            graph_filename("obs-preds", None, arch)
        ),
        dpi=300
    )
    plt.close(fig)


# ================================
# CRITICAL DIFFERENCE DIAGRAM
# ================================
def plot_critical_difference(metrics, metric, arch):
    q_alpha_05 = {
        2: 1.960, 3: 2.343, 4: 2.569, 5: 2.728,
        6: 2.850, 7: 2.949, 8: 3.031, 9: 3.102, 10: 3.164
    }

    models = list(metrics.keys())
    k = len(models)

    values = np.array([metrics[m][metric] for m in models]).T
    N = values.shape[0]

    ranks = np.array([rankdata(row, method="average") for row in values])
    mean_ranks = ranks.mean(axis=0)

    q = q_alpha_05.get(k, q_alpha_05[max(q_alpha_05)])
    cd = q * np.sqrt(k * (k + 1) / (6 * N))

    fig, ax = plt.subplots(figsize=(10, 3))
    fig.subplots_adjust(left=0.05, right=0.98, top=0.85, bottom=0.30)

    ax.axhline(0.5, color="black")

    for i, rank in enumerate(mean_ranks):
        ax.plot(rank, 0.5, "o", markersize=8)
        ax.text(rank, 0.65, models[i], rotation=25,
                ha="center", va="bottom", fontsize=10, fontweight="bold")

    min_rank = min(mean_ranks)
    ax.plot([min_rank, min_rank + cd], [0.3, 0.3], lw=2)
    ax.text(min_rank + cd / 2, 0.18, f"CD = {cd:.2f}", ha="center")

    ax.set_xlim(0.5, k + 0.5)
    ax.set_ylim(0, 1)
    ax.set_yticks([])
    ax.set_xlabel("Mean Rank (lower is better)")
    ax.set_title(f"Critical Difference Diagram ({metric.upper()})")

    fig.savefig(
        os.path.join(
            GRAPH_DIR,
            graph_filename("critical-diff", metric, arch)
        ),
        dpi=300,
        bbox_inches="tight"
    )
    plt.close(fig)


# ================================
# MAIN
# ================================
def main():
    metric_files = [
        f for f in os.listdir(BASE_DIR)
        if f.startswith("metrics_data_all") and f.endswith(".json")
    ]

    if not metric_files:
        raise RuntimeError("No metrics_data_*.json files were found.")

    for mf in metric_files:
        arch = get_arch_name(mf)
        print(f"[INFO] Processing architecture: {arch}")

        metrics = load_json(os.path.join(BASE_DIR, mf))
        #loss = load_json(os.path.join(BASE_DIR, f"loss_data_{arch}.json"))

        for metric, label in [
            ("r2", "R²"),
            ("rmse", "RMSE"),
            ("mse", "MSE"),
            ("mape2", "MAPE"),
            ("mae", "MAE"),
        ]:
            plot_metric_boxplot(metrics, metric, label, arch)
            plot_critical_difference(metrics, metric, arch)

        #plot_obs_preds(metrics, arch)
        #plot_loss(loss, arch)

    print(f"[OK] All graphs have been generated in: {GRAPH_DIR}")


if __name__ == "__main__":
    main()
