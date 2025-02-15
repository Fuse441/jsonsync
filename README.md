JsonSync Extension for VS Code
JsonSync is a VS Code extension that helps you compare JSON files with data stored in MongoDB collections. The extension reads configuration files from your workspace and compares them against MongoDB collections to check for any differences.

Features
Compare JSON configuration files against MongoDB collections.
Output the results in the VS Code output panel with color-coded results:
🟩 No differences found.
🟥 Differences found.
Supports working with different collections specified in .env.
Requirements
MongoDB instance running and accessible.
.env file in the root directory with the following variables:
DATABASE_URL: MongoDB connection URL.
DATABASE_NAME: The name of the MongoDB database.
COMMON: The directory for common JSON files to compare.
Installation
Open your VS Code.
Go to Extensions View (Ctrl+Shift+X).
Search for JsonSync and click Install.
Usage
Make sure you have a MongoDB instance running and properly configured.
Ensure that your project has a .env file with the required variables:
DATABASE_URL: Your MongoDB URL.
DATABASE_NAME: The name of your MongoDB database.
COMMON: Path to the common JSON files folder.
Use the Compare JSON command from the Command Palette (Ctrl+Shift+P) or bind it to a custom shortcut.
View the results in the Output panel of VS Code. You will see whether the JSON files match with the MongoDB collections or not.
Configuration
.env file example:
Collections
The extension works with two types of collections:

Array Collections: Specified in the arrCollection array in the code.
Common Collections: Specified in the commonCollection array in the code.
You can modify the list of collections to fit your project needs.

Development
Clone the repository.
Install the dependencies:
npm install
