import * as assert from "assert";
import * as vscode from "vscode";
import { COMMAND_KEYS } from "src/constant";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const myExtension = require('../extension');

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	
	// test demo
	// test('Sample test', () => {
	// 	assert.equal(-1, [1, 2, 3].indexOf(5));
	// 	assert.equal(-1, [1, 2, 3].indexOf(0));
	// });
	
	test('Transform Command Test', async function () {
		// this test will open vsocde and create file, may need more time than 2s
		this.timeout(15000);

		const config = vscode.workspace.getConfiguration("transform");
		await config.update('multiplier', 10);
		await config.update('sourceUnit', 'px');
		await config.update('targetUnit', 'rem');
		await config.update('unitPrecision', 2);

		// create a file and write content
		const doc = await vscode.workspace.openTextDocument({
			content: '1px .1px \n 0.1px'
		});
		const editor = await vscode.window.showTextDocument(doc);

		// mock user selection of multiple rows
		const selection = new vscode.Selection(0, 0, 2, 0);
		editor.selection = selection;
		
		// mock user perform transform
		await vscode.commands.executeCommand(COMMAND_KEYS.TRANSFORM);
		
		const newText = editor.document.getText();
		assert.strictEqual(newText, '10rem 1rem \n 1rem');
	});
});
