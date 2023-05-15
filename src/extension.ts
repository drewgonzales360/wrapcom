import * as vscode from 'vscode';
import * as comments from "./comments";

const configurationSection = 'LineLength';
const defaultLineLength = -1;

export function wrapLongCommentLines() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("no editor")
        return
    }

    const lineLength = vscode.workspace.getConfiguration().get(configurationSection, defaultLineLength);
    if (lineLength === -1) {
        vscode.window.showErrorMessage("could not read line length setting")
    }

    let block = new comments.CommentBlock("", new vscode.Position(0,0), new vscode.Position(0,0))
    try {
        block = comments.getCommentBlock()
    } catch (error: any) {
        vscode.window.showErrorMessage(error.toString())
    }
    const lines = comments.splitLines(block.text, lineLength)
    const wrappedLines = comments.addCommentPrefix(lines)

    const range = new vscode.Range(block.start, block.end);
    const edit = new vscode.TextEdit(range, wrappedLines);
    const workspaceEdit = new vscode.WorkspaceEdit();
    const document = editor.document;
    workspaceEdit.set(document.uri, [edit]);
    vscode.workspace.applyEdit(workspaceEdit);
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('wrapcom.WrapLines', wrapLongCommentLines);
    context.subscriptions.push(disposable);
}
