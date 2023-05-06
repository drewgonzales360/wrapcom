import * as vscode from 'vscode';

export function wrapLongCommentLines() {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
        const document = editor.document;
        const selection = editor.selection;
        const text = document.getText(selection);
        const lines = text.split('\n');

        const wrappedLines = lines.map(line => {
            if (line.length > 80) {
                const words = line.split(' ');
                let wrapped = '';
                let currentLineLength = 0;
                for (let i = 0; i < words.length; i++) {
                    const word = words[i];
                    if (currentLineLength + word.length + 1 > 80) {
                        wrapped += '\n';
                        currentLineLength = 0;
                    }
                    wrapped += word + ' ';
                    currentLineLength += word.length + 1;
                }
                return wrapped.trim();
            } else {
                return line;
            }
        });

        const range = new vscode.Range(selection.start, selection.end);
        const edit = new vscode.TextEdit(range, wrappedLines.join('\n'));
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(document.uri, [edit]);
        vscode.workspace.applyEdit(workspaceEdit);
    }
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('linethewrapper.WrapLines', wrapLongCommentLines);

    context.subscriptions.push(disposable);
}
