const path = require("path");
const vscode = require("vscode");
const fs = require("fs/promises");
const { MongoClient } = require("mongodb");
const jsonDiff = require("json-diff");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const arrCollection = [
    "protocol",
    "validateCommand",
    "command",
    "condition",
    "mappingResponse",
    "responseFormat",
    "responseStatus",
    "resource_profile",
    "resource_token",
  ];
  const commonCollection = ["command", "condition", "responseStatus"];
  const workSpace = vscode.workspace.workspaceFolders;
  const outputChannel = vscode.window.createOutputChannel("JsonSysnc");
  const disposable = vscode.commands.registerCommand(
    "jsonsync.compareJSON",
    async function () {
		const startTime = Date.now(); 
      outputChannel.show();
      outputChannel.clear();
      let envObject = {};
      if (workSpace && workSpace.length > 0) {
        try {
          const fileENV = path.join(workSpace[0].uri.fsPath, ".env");
          const dataENV = await fs.readFile(fileENV, "utf-8");

          envObject = dataENV
            .split("\n")
            .filter((line) => line.trim() && !line.startsWith("#"))
            .reduce((acc, line) => {
              const [key, value] = line.split("=").map((str) => str.trim());
              acc[key] = value;
              return acc;
            }, {});

          console.log(envObject);

          const mongoUrl = String(envObject.DATABASE_URL).replace(/\"/g, "");
          const dbName = String(envObject.DATABASE_NAME).replace(/\"/g, "");
          const commonFolder = String(envObject.COMMON).replace(/\"/g, "");
          if (!mongoUrl || !dbName) {
            vscode.window.showErrorMessage(
              "DATABASE_URL or DATABASE_NAME is missing in .env"
            );
            return;
          }

          console.log(mongoUrl);
          const client = new MongoClient(mongoUrl);
          await client.connect();
          vscode.window.showInformationMessage(
            `Connected to MongoDB: ${mongoUrl}.${dbName}`
          );

          const db = client.db(dbName);
          // console.log(`Connected to database: ${dbName}`);
          async function compareCollections(
            db,
            outputChannel,
            collectionName,
            folderPath
          ) {
            let stateDiff = { status: true, result: "" };
            const collection = await db.collection(collectionName);
            const dirJSON = await fs.readdir(folderPath, "utf-8");

            if (dirJSON.length > 0) {
              for (const config of dirJSON) {
                const pathFile = path.join(folderPath, config);
                const dataJSON = await fs.readFile(pathFile, "utf-8");
                const documents = await collection
                  .find(JSON.parse(dataJSON))
                  .toArray();

                if (documents.length === 0) {
                  stateDiff.status = false;
                  stateDiff.result += `${collectionName}-${config} Found a point of difference\n`;
                }
              }

              if (stateDiff.status) {
                outputChannel.appendLine(`🟩 ${collectionName} No different`);
              } else {
                outputChannel.appendLine(
                  `🟥 ${collectionName} Found different`
                );
                outputChannel.appendLine(stateDiff.result);
              }
            }
          }
          outputChannel.appendLine(`--------- difference config ---------`);
          for (const element of arrCollection) {
            const fileCollection = path.join(workSpace[0].uri.fsPath, element);
            await compareCollections(
              db,
              outputChannel,
              element,
              fileCollection
            );
          }

          outputChannel.appendLine(`--------- difference common ---------`);
          for (const commonEle of commonCollection) {
            const fileCollection = path.join(
              workSpace[0].uri.fsPath,
              commonFolder,
              commonEle
            );
            await compareCollections(
              db,
              outputChannel,
              commonEle,
              fileCollection
            );
          }

          await client.close();
		  const endTime = Date.now(); 
          const totalTime = ((endTime - startTime) / 1000).toFixed(2);
          outputChannel.appendLine(`--------- Time ${totalTime} seconds ---------`);

        } catch (error) {
          vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
      } else {
        vscode.window.showErrorMessage("No workspace found");
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
