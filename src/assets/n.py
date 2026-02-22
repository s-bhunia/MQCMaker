import json

def remove_duplicate_topics(input_filename, output_filename):
    """
    Reads a JSON file containing subjects with topic arrays, removes duplicate topics,
    and writes the unique topics to a new JSON file.
    """
    try:
        # Read the data from the input JSON file
        with open(input_filename, 'r') as f_in:
            data = json.load(f_in)

        # Check if the loaded data is a dictionary
        if not isinstance(data, dict):
            print("Error: JSON file does not contain a dictionary of subjects.")
            return

        # Process each subject and remove duplicates from its topics
        unique_data = {}
        for subject, topics in data.items():
            if isinstance(topics, list):
                # Use a set to remove duplicates, then convert back to list and sort
                unique_topics = sorted(list(set(topics)))
                unique_data[subject] = unique_topics
            else:
                unique_data[subject] = topics

        # Write the unique data to the output JSON file
        with open(output_filename, 'w') as f_out:
            json.dump(unique_data, f_out, indent=2)
        
        print(f"Successfully removed duplicates. Unique topics saved to {output_filename}")

    except FileNotFoundError:
        print(f"Error: The file '{input_filename}' was not found.")
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from the file '{input_filename}'. Check file format.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Example usage:
input_file = 'src/assets/topic.json'
output_file = 'src/assets/output_unique.json'
remove_duplicate_topics(input_file, output_file)
