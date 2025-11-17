import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats.mstats import winsorize
import numpy as np

def load_dataset(file_path):
     # Load the dataset from the specified path
    return pd.read_csv(file_path)

def list_columns(data):
    """
    Lists all column names in the dataset.

    Parameters:
    data (DataFrame): Dataset for which to list column names.

    Returns:
    list: A list of column names in the dataset.
    """
    # Get the list of column names
    columns = data.columns.tolist()

    # Print and return the list of columns
    print("Columns in the dataset:")
    for column in columns:
        print(column)

    return columns

def remove_unused_collumns(data):
    data['duration'] = data['elapsed'] - data['Latency']
    data.loc[data['duration'] == 0, 'duration'] = 1
    return data.drop(columns=['timeStamp', 'label', 'usecase', 'Latency', 'elapsed', 'success'], axis=1)

def remove_duplicates(data):
    """
    Loads a CSV file, removes duplicate rows, prints the number of rows removed,
    and displays the rows that were removed.

    Parameters:
    file_path (str): Path to the CSV file.
    """

    # Display the initial number of rows
    initial_row_count = data.shape[0]

    # Identify duplicate rows
    duplicate_rows = data[data.duplicated()]

    # Remove duplicate rows
    data_cleaned = data.drop_duplicates()

    # Display the number of rows after removing duplicates
    final_row_count = data_cleaned.shape[0]

    # Calculate the number of removed rows
    removed_rows_count = initial_row_count - final_row_count

    # Print the result
    print(f"Number of rows removed: {removed_rows_count}")
    print("Removed rows:")
    print(duplicate_rows)

    return data_cleaned

def check_and_remove_missing_values(data):
    """
    Loads a CSV file, checks for missing values, displays rows with missing fields,
    and returns the dataset without rows containing missing values.

    Parameters:
    file_path (str): Path to the CSV file.

    Returns:
    DataFrame: Dataset without rows containing missing values.
    """
    # Identify rows with any missing values
    rows_with_missing = data[data.isnull().any(axis=1)]

    # Check if there are any missing values
    if rows_with_missing.empty:
        print("No missing values found.")
    else:
        # Display the rows with missing values and the count
        print(f"Number of rows with missing values: {rows_with_missing.shape[0]}")
        print("Rows with missing values:")
        print(rows_with_missing)

    # Remove rows with missing values
    data_cleaned = data.dropna()

    return data_cleaned

def categorize(data):
    encoders = {}
    for column in ['provider', 'input_level']:
        if data[column].dtype == 'object':
            label_encoder = LabelEncoder()
            data[column] = label_encoder.fit_transform(data[column])
            encoders[column] = label_encoder
        else:
            print(f"The collumn {column} is already codified.")
    return data, encoders

def decategorize(data, encoders):
    for column, label_encoder in encoders.items():
        data[column] = label_encoder.inverse_transform(data[column].astype(int))    
    return data

def normalize(data):
    normalized_data = data.copy()
    columns_to_normalize = [col for col in data.columns]
    # Initialize the StandardScaler and fit-transform on the selected columns
    scaler = StandardScaler()
    normalized_data[columns_to_normalize] = scaler.fit_transform(data[columns_to_normalize])
    return normalized_data, scaler

def denormalize(normalized_data, scaler):
    """
    Reverts the normalization using the provided scaler.

    Parameters:
    normalized_data (DataFrame): The normalized dataset.
    scaler (StandardScaler): The scaler that was used to normalize the dataset.

    Returns:
    DataFrame: The dataset returned to its original scale.
    """
    # Inverse transform the normalized data
    original_data = normalized_data.copy()
    original_data[normalized_data.columns] = scaler.inverse_transform(normalized_data[normalized_data.columns])
    
    return original_data

def identify_outliers(data):
    """
    Identifies outliers in each numerical column of the dataset using the IQR method.

    Parameters:
    data (DataFrame): Dataset to analyze for outliers.

    Returns:
    dict: A dictionary where keys are column names and values are DataFrames containing outlier rows.
    """
    outliers = {}

    for column in data.select_dtypes(include=['float64', 'int64']).columns:
        # Calculate Q1 (25th percentile) and Q3 (75th percentile) for the column
        Q1 = data[column].quantile(0.25)
        Q3 = data[column].quantile(0.75)
        IQR = Q3 - Q1

        # Determine outliers using IQR method
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        outlier_rows = data[(data[column] < lower_bound) | (data[column] > upper_bound)]

        # If there are outliers, add them to the dictionary
        if not outlier_rows.empty:
            outliers[column] = outlier_rows
            print(f"Outliers detected in column '{column}':")
            print(outlier_rows)
            print()

    return outliers

import pandas as pd

def remove_outliers(data):
    """
    Identifies and removes outliers in each numerical column of the dataset using the IQR method.

    Parameters:
    data (DataFrame): Dataset to analyze and clean for outliers.

    Returns:
    DataFrame: Dataset with outliers removed.
    """
    # Loop through each numerical column to identify and remove outliers
    for column in data.select_dtypes(include=['float64', 'int64']).columns:
        # Calculate Q1 (25th percentile) and Q3 (75th percentile) for the column
        Q1 = data[column].quantile(0.25)
        Q3 = data[column].quantile(0.75)
        IQR = Q3 - Q1

        # Determine bounds for outliers using IQR method
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR

        # Remove rows where the column values are outliers
        data = data[(data[column] >= lower_bound) & (data[column] <= upper_bound)]

    return data

def replace_outliers_with_median(data):
    """
    Identifies outliers in each numerical column of the dataset using the IQR method and 
    replaces them with the median of the respective column.

    Parameters:
    data (DataFrame): Dataset to analyze and clean for outliers.

    Returns:
    DataFrame: Dataset with outliers replaced by the median.
    """
    # Loop through each numerical column to identify and replace outliers
    for column in data.select_dtypes(include=['float64', 'int64']).columns:
        # Calculate Q1 (25th percentile) and Q3 (75th percentile) for the column
        Q1 = data[column].quantile(0.25)
        Q3 = data[column].quantile(0.75)
        IQR = Q3 - Q1

        # Determine bounds for outliers using IQR method
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR

        # Find outlier values and replace them with the median of the column
        median_value = data[column].median()
        data[column] = data[column].apply(lambda x: median_value if x < lower_bound or x > upper_bound else x)

    return data.dropna()

def correlation_analysis(data, dir, plot=True, title="main"):
    """
    Performs correlation analysis on the dataset and visualizes the correlation matrix.
    
    Parameters:
    file_path (str): Path to the CSV file.
    """
    # Calculate the correlation matrix
    correlation_matrix = data.corr()

    # Display the correlation matrix
    print("Correlation Matrix:")
    print(correlation_matrix)

    if plot:
        # Visualize the correlation matrix using a heatmap
        plt.figure(figsize=(10, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=0.5)
        plt.title("Correlation Heatmap")
        plt.savefig(f"{dir}/graph-correlation-heatmap-{title}.png")
        plt.close()

def winsorization(data):
    print("-------DATASET UNWINSORIZED--------")
    print(data)
    print("-------DATASET UNWINSORIZED (CLEANED) --------")
    data_cleaned = check_and_remove_missing_values(data)
    print(data_cleaned)
    limit_down = 0.15
    limit_up = 0.15
    df_winsorized = data_cleaned.copy()
    df_winsorized[df_winsorized.select_dtypes(include=['number']).columns] = df_winsorized.select_dtypes(include=['number']).apply(lambda x: winsorize(x.to_numpy(),limits=[limit_down, limit_up]))
    print("-------DATASET WINSORIZED--------")
    print(df_winsorized)
    df_winsorized_cleaned = check_and_remove_missing_values(df_winsorized)
    print("-------DATASET WINSORIZED (CLEANED) --------")
    print(df_winsorized_cleaned)
    return df_winsorized_cleaned

def reduce_scale_pca(data, cols_pca):
    # Remove columns with zero variance
    variances = data[cols_pca].var()
    cols_nonconstant = variances[variances > 0].index.tolist()
    if len(cols_nonconstant) == 0:
        raise ValueError("All selected columns have zero variance.")

    print(f"Columns kept for PCA (variance > 0): {cols_nonconstant}")

    # Normalize the data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(data[cols_nonconstant])
    
    # Create temporary DataFrame for cleaning
    df_temp = pd.DataFrame(X_scaled, index=data.index, columns=cols_nonconstant)

    # Replace inf values with NaN
    df_temp.replace([np.inf, -np.inf], np.nan, inplace=True)

    # Clip extreme values to prevent overflow
    max_val = df_temp.values.max()
    min_val = df_temp.values.min()
    if np.abs(max_val) > 1e6 or np.abs(min_val) > 1e6:
        print(f"Warning: Extreme values detected (min={min_val}, max={max_val}). Clipping applied.")
        df_temp = np.clip(df_temp, -1e6, 1e6)

    # Remove outliers using IQR method
    Q1 = df_temp.quantile(0.25)
    Q3 = df_temp.quantile(0.75)
    IQR = Q3 - Q1
    mask_outliers = ~((df_temp < (Q1 - 1.5 * IQR)) | (df_temp > (Q3 + 1.5 * IQR))).any(axis=1)
    df_temp = df_temp[mask_outliers]

    # Drop any remaining NaNs
    df_temp.dropna(inplace=True)

    if df_temp.empty:
        raise ValueError("No data left after cleaning (NaNs/Infs/Outliers removal).")

    # Apply PCA with 1 component
    pca = PCA(n_components=1)
    principal_components = pca.fit_transform(df_temp)

    # Create DataFrame with the PCA result
    df_pca = pd.DataFrame(principal_components, columns=["PCA1"], index=df_temp.index)

    # Merge with original DataFrame (only valid rows)
    df = data.merge(df_pca, left_index=True, right_index=True)

    return df.dropna(), pca, scaler
    
def remove_reduced_collumns(data, cols_pca):
    return data.drop(columns=cols_pca, axis=1)

def remove_spikes(data):
    #return data
    df = pd.DataFrame(data)
    window_size = 10
    weights = np.arange(1, window_size + 1)
    df['WMA'] = df['duration'].rolling(window=window_size).apply(lambda x: np.dot(x, weights) / weights.sum(), raw=True)
    print(data['duration'])
    print(df['WMA'])
    df['duration'] = df['WMA']
    return df.drop(['WMA'], axis=1).dropna()

