import pandas as pd

def compute_difference_statistics(csv_file="/dataset/outputs/dataset.csv"):
    # Load dataset
    df = pd.read_csv(csv_file)

    # Check required columns
    required_columns = {"elapsed", "Connect"}
    if not required_columns.issubset(df.columns):
        raise ValueError(f"The dataset must contain the columns: {required_columns}")

    df = df[df["success"] == True]

    # Compute difference
    df["difference"] = df["elapsed"] - df["Connect"]

    # Calculate statistics
    stats = {
        "min": df["difference"].min(),
        "max": df["difference"].max(),
        "mean": df["difference"].mean(),
        "median": df["difference"].median()
    }

    return stats


if __name__ == "__main__":
    statistics = compute_difference_statistics("/dataset/outputs/dataset.csv")

    print("Statistics for (Elapsed - Connection):")
    print(f"Minimum: {statistics['min']}")
    print(f"Maximum: {statistics['max']}")
    print(f"Mean: {statistics['mean']}")
    print(f"Median: {statistics['median']}")
