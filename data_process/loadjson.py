import csv
import json

def json_to_csv(json_data, csv_file_path):
    # Extract the header from the first item in the JSON array
    header = json_data[0].keys() if json_data else []

    # Open the CSV file in write mode
    with open(csv_file_path, 'w', newline='') as csv_file:
        # Create a CSV writer object
        csv_writer = csv.writer(csv_file)

        # Write the header to the CSV file
        csv_writer.writerow(header)

        # Write each row of data to the CSV file
        for row in json_data:
            csv_writer.writerow(row.values())

# Example usage:
with open("races.json", 'r') as json_file:
    # Load the JSON data into a Python object
    json_data = json.load(json_file)


csv_file_path = 'output.csv'
json_to_csv(json_data, csv_file_path)
print(f'CSV file created: {csv_file_path}')

