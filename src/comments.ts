import * as vscode from "vscode";

export class CommentBlock {
  text: string;
  start: vscode.Position;
  end: vscode.Position;

  constructor(text: string, start: vscode.Position, end: vscode.Position) {
    this.text = text;
    this.start = start;
    this.end = end;
  }
}

export function getCommentBlock(): CommentBlock {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    throw new Error('no editor');
  }

  const document = editor.document;
  const selection = editor.selection;
  const position = selection.active;

  const text = document.getText();
  const lines = text.split("\n");

  let startLine = position.line;
  while (startLine >= 0 && isComment(lines[startLine])) {
    startLine--;
  }

  let endLine = position.line;
  while (endLine < lines.length && isComment(lines[endLine])) {
    endLine++;
  }

  const commentText = lines.slice(startLine, endLine).map(l => stripComment(l)).join(" ");

  return new CommentBlock(
    commentText,
    new vscode.Position(startLine, 0),
    new vscode.Position(endLine-1, getLineLength(document, endLine - 1)),
  )
}

function getLineLength(document: vscode.TextDocument, lineNumber: number): number {
  const line = document.lineAt(lineNumber);
  return line.text.length;
}

function isComment(line: string): boolean {
  const trimmedLine = line.trim();
  return trimmedLine.startsWith(getCommentPrefix());
}

function stripComment(line: string): string {
  const prefix = getCommentPrefix()

  if (line.startsWith(prefix)) {
    return line.slice(prefix.length).trim();
  }

  return line;
}

export function splitLines(str: string, maxLength: number): string[] {
  const words = str.split(' ');
  const lines = [];
  let currentLine = '';
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (currentLine.length + word.length + 1 > maxLength) {
      lines.push(currentLine.trim());
      currentLine = '';
    }
    currentLine += `${word} `;
  }
  lines.push(currentLine.trim());

  return lines;
}

export function addCommentPrefix(lines: string[]): string {
  const prefix = getCommentPrefix()
  return lines.map(line => `\n${prefix} ${line}`).join("");
}

function getCommentPrefix(): string {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return '';
  }

  const language = editor.document.languageId;
  switch (language) {
    case 'typescript':
    case 'javascript':
    case 'go':
      return '//';
    case 'python':
      return '#';
    default:
      return '';
  }
}
