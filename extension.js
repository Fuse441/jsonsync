
const path = require('path');
const vscode = require('vscode');
const fs = require('fs/promises');
const { MongoClient } = require('mongodb'); // เพิ่ม MongoClient
const jsonDiff = require('json-diff');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const arrCollection = ["protocol"];
	const workSpace = vscode.workspace.workspaceFolders;
	const disposable = vscode.commands.registerCommand('jsonsync.compareJSON', async function () {
		let envObject = {}
		if (workSpace && workSpace.length > 0) {
			try {
				const fileENV = path.join(workSpace[0].uri.fsPath, '.env');
				const dataENV = await fs.readFile(fileENV, 'utf-8');
				
					 envObject = dataENV.split('\n')
					.filter(line => line.trim() && !line.startsWith('#'))
					.reduce((acc, line) => {
						const [key, value] = line.split('=').map(str => str.trim());
						acc[key] = value;
						return acc;
					}, {});

				console.log(envObject);

			
				const mongoUrl = String(envObject.DATABASE_URL).replace(/\"/g, "");
				const dbName = String(envObject.DATABASE_NAME).replace(/\"/g, "");

				if (!mongoUrl || !dbName) {
					vscode.window.showErrorMessage('DATABASE_URL or DATABASE_NAME is missing in .env');
					return;
				}

				console.log(mongoUrl)
				const client = new MongoClient(mongoUrl);
				await client.connect();
				vscode.window.showInformationMessage(`Connected to MongoDB: ${mongoUrl}`);

			
				const db = client.db(dbName);
				console.log(`Connected to database: ${dbName}`);

				for (const element of arrCollection) {
					const collection = await db.collection(element)
			
				const fileCollection = path.join(workSpace[0].uri.fsPath, element);
				const dirJSON = await fs.readdir(fileCollection, 'utf-8');
				if(dirJSON.length > 0){
					for (const config of dirJSON) {
					const pathFile = path.join(workSpace[0].uri.fsPath,element,config);
					const dataJSON = await fs.readFile(pathFile,'utf-8')
					const documents =  await collection.findOne({dataJSON})
					console.log(`match ==> ${documents}`)
						
					}
				}
				}
				
			
				await client.close();
			} catch (error) {
				vscode.window.showErrorMessage(`Error: ${error.message}`);
			}
		} else {
			vscode.window.showErrorMessage('No workspace found');
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
