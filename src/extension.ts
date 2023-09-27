import * as vscode from 'vscode';
import { COMMAND_KEYS } from './constant';
import { inverseTransform, transform } from './commands';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      COMMAND_KEYS.TRANSFORM,
      transform
    ),
    vscode.commands.registerTextEditorCommand(
      COMMAND_KEYS.INVERSE_TRANSFORM,
      inverseTransform
    )
  );
}

export function deactivate() {}
