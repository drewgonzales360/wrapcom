import * as vscode from 'vscode';
import * as comments from './comments';

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

    if (!comments.cursorOnComment(editor)) {
        return
    }

    const commentBlock = comments.getCommentBlock(editor)
    const edit = comments.wrapComment(commentBlock, lineLength)

    const workspaceEdit = new vscode.WorkspaceEdit();
    const document = editor.document;
    workspaceEdit.set(document.uri, [edit]);
    vscode.workspace.applyEdit(workspaceEdit);
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('wrapcom.WrapLines', wrapLongCommentLines);
    context.subscriptions.push(disposable);
}
