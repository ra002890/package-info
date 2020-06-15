import * as vscode from 'vscode';
import { walk } from './walk';
import * as fs from 'fs';

function getJavaPackageName(path: string): string | null {
    let foundPackage = path.match(".*\/src\/(main|test)\/java\/(.*)");
    console.log(`${foundPackage} --- ${path}`);
    if (!foundPackage || foundPackage.length < 3) {
        return null;
    } else {
        return foundPackage[2].replace(/\//g, ".");
    }
}

function createPackageInfo(path: string, packageName: string): boolean {
    let packageInfoPath = `${path}/package-info.java`;
    if (!fs.existsSync(packageInfoPath)) {
        fs.writeFileSync(packageInfoPath, `package ${packageName};`);
        return true;
    } else {
        return false;
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "helloworld" is now active!');

    let oc: vscode.OutputChannel = vscode.window.createOutputChannel("Generate package-info.java status");

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('helloworld.packageInfo', (uri: vscode.Uri) => {

        // The code you place here will be executed every time your command is executed
        console.log(uri.fsPath);
        let successCounter = 0;
        let warnCounter = 0;
        let errorCounter = 0;
        walk(uri.fsPath, (err, mdone) => {
            mdone?.forEach((value, index) => {
                let packageName = getJavaPackageName(value);
                if (packageName) {
                    try {
                        if (createPackageInfo(value, packageName)) {
                            oc.appendLine(`Package-info.java file create successfully at ${value}.`);
                            successCounter++;
                        } else {
                            oc.appendLine(`Package-info.java already exists at ${value}.`);
                            warnCounter++;
                        }
                    } catch (error) {
                        oc.appendLine(`Severe error found:\n${error}`);
                        errorCounter++;
                    }
                } else {
                    oc.appendLine("Package not found or it is not a valid Java package to insert package-info.java.");
                    errorCounter++;
                }
                if (index === (mdone.length - 1)) {
                    vscode.window.showInformationMessage('Hello World from HelloWorld!', 'Show console').then(
                        selection => {
                            oc.show();
                        });
                }
            });
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    vscode.window.showInformationMessage('Package-info was deactivated!');
}
