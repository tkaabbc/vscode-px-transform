const path = require('path');

const { runTests } = require('vscode-test');

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../');

		// The path to the extension test script
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// open workspace for updating vscode config successfully, if not, vscode.workspace.getConfiguration("transform").update() will fail
		const testWorkspace = path.resolve(__dirname, './test-workspace/workspace');

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath, extensionTestsPath, launchArgs: [testWorkspace], });
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
