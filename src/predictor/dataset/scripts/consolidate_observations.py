import pandas as pd
import os
import re
import json

# Function to convert the label field
def convert_label(label):
    # Use a regular expression to extract the number from the string
    match = re.search(r"Repetition \d+ under (\d+) of concurrency", label)
    if match:
        return int(match.group(1))
    else:
        return label  # Return the original value if no match is found

# Function to process CSV files
def process_csv_files(input_directory, output_file):
    # List to store dataframes from each file
    dataframes = []

    # Iterate through all files in the directory
    for filename in os.listdir(input_directory):
        if filename.endswith(".csv"):
            file_path = os.path.join(input_directory, filename)
            # Extract provider and usecase information from the filename
            base_name = os.path.splitext(filename)[0]
            try:
                provider, usecase, _ = base_name.split('-')
            except ValueError:
                print(f"The file {filename} is not in the expected format and will be ignored.")
                continue

            # Read the CSV file
            df = pd.read_csv(file_path)
            # Check if the necessary columns are present
            if all(column in df.columns for column in ['timeStamp', 'elapsed', 'label', 'success', 'Latency']):
                # Select only the desired columns
                df_filtered = df[['timeStamp', 'elapsed', 'label', 'success', 'Latency']]
                # Convert the values in the label field
                df_filtered.insert(3,'concurrency', df_filtered['label'].apply(convert_label))
                # Add 'provider' and 'usecase' columns with extracted values
                #df_filtered.loc[:,'provider'] = provider
                #df_filtered.loc[:,'usecase'] = usecase
                
                df_filtered.insert(4, "provider", provider)
                df_filtered.insert(5, "usecase", usecase)

                # Load the Halstead JSON
                halstead_source = input_directory + "/../usecases/" + usecase + "/" + provider + "/halstead/consolidated.json"
                with open(halstead_source, 'r') as consolidated_halstead:
                        halstead_json = json.load(consolidated_halstead)
                for metric in halstead_json:
                    if (metric != "files" and metric != "path" ):
                        df_filtered.insert(6, metric, halstead_json[metric])
                # Add the filtered dataframe to the list
                dataframes.append(df_filtered)
            else:
                print(f"The file {filename} does not contain all necessary columns and will be ignored.")

    # Concatenate all dataframes into a single dataframe
    if dataframes:
        combined_df = pd.concat(dataframes)
        # Save the combined dataframe to a new CSV file
        combined_df.to_csv(output_file, index=False)
        print(f"File {output_file} created successfully.")
    else:
        print("No valid files found for processing.")

# Define the input directory and the output file
input_directory = '../inputs/observations'
output_file = '../outputs/dataset.csv'

# Call the function to process the files
process_csv_files(input_directory, output_file)