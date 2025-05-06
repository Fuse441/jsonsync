# JsonSync Extension for VS Code

JsonSync is a VS Code extension that helps you compare JSON files with data stored in MongoDB collections. The extension reads configuration files from your workspace and compares them against MongoDB collections to check for any differences.

## Features

- Compare JSON configuration files against MongoDB collections.
- Output the results in the VS Code output panel with color-coded results:
  - 🟩 No differences found.
  - 🟥 Differences found.
- Supports working with different collections specified in `.env`.

## Requirements

- MongoDB instance running and accessible.
- `.env` file in the root directory with the following variables:
  - `DATABASE_URL`: MongoDB connection URL.
  - `DATABASE_NAME`: The name of the MongoDB database.
  - `COMMON`: The directory for common JSON files to compare.

## Installation

1. Open your VS Code.
2. Go to Extensions View (`Ctrl+Shift+X`).
3. Search for `JsonSync` and click **Install**.

## Usage

1. Make sure you have a MongoDB instance running and properly configured.
2. Ensure that your project has a `.env` file with the required variables:
   - `DATABASE_URL`: Your MongoDB URL.
   - `DATABASE_NAME`: The name of your MongoDB database.
   - `COMMON`: Path to the common JSON files folder.
3. Use the `Compare JSON` command from the Command Palette (`Ctrl+Shift+P`) or bind it to a custom shortcut.
4. View the results in the Output panel of VS Code. You will see whether the JSON files match with the MongoDB collections or not.

## Configuration

### `.env` file example:


### Collections

The extension works with two types of collections:

1. **Array Collections**: Specified in the `arrCollection` array in the code.
2. **Common Collections**: Specified in the `commonCollection` array in the code.

You can modify the list of collections to fit your project needs.

## Development

1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm install


