// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

function findNextCharAfterSpace(line: vscode.TextLine, start: vscode.Position, next: boolean): number {
	const step = next ? 1 : -1;
	const boundary: number = next ? line.range.end.character : line.range.start.character;
	var find_ws = true;
	for (var _i = start.character; ; _i += step) {
		if (_i === boundary) { return _i; }
		if (find_ws && _i!==start.character && (line.text[_i] === ' ' || line.text[_i] === '\t'))
		{
			find_ws = false;
		}
		else if(!find_ws && (line.text[_i] !== ' ' && line.text[_i] !== '\t'))
		{
			return next? _i : _i+1;
		}

	}
	return start.character; // should be unreachable
}

function markSelection(editor: vscode.TextEditor, next_line: number, next_char: number) {
	const active = editor.selection.active.with(next_line, next_char);
	editor.selection = new vscode.Selection(active, active);
	editor.revealRange(new vscode.Range(active, active));
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand("hjump.jumpRight", () => {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) { return; }
		var next_char = findNextCharAfterSpace(editor.document.lineAt(editor.selection.active.line), editor.selection.active, true);
		markSelection(editor, editor.selection.active.line, next_char);
	}));

	context.subscriptions.push(vscode.commands.registerCommand("hjump.jumpLeft", () => {
		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) { return; }
		var next_char = findNextCharAfterSpace(editor.document.lineAt(editor.selection.active.line), editor.selection.active, false);
		markSelection(editor, editor.selection.active.line, next_char);
	}));
}

// this method is called when your extension is deactivated
export function deactivate() { }
