import * as vscode from "vscode";

export class CommentBlock {
  prefix: string;
  text: string;
  start: vscode.Position;
  end: vscode.Position;

  constructor(prefix: string, text: string, start: vscode.Position, end: vscode.Position) {
    this.prefix = prefix;
    this.text = text;
    this.start = start;
    this.end = end;
  }
}

export function wrapComment(commentBlock: CommentBlock, desiredLineLength: number): vscode.TextEdit {
  const wrappedCommentText = wrapCommentText(commentBlock.text, commentBlock.prefix, desiredLineLength)
  const range = new vscode.Range(commentBlock.start, commentBlock.end);

  return new vscode.TextEdit(range, wrappedCommentText);
}

export function cursorOnComment(editor: vscode.TextEditor): boolean {
  const line = editor.selection.active.line
  const text = editor.document.lineAt(line).text
  const prefix = getCommentPrefix(editor)
  return isComment(prefix, text)
}

export function getCommentBlock(editor: vscode.TextEditor): CommentBlock {
  if (!editor) {
    throw new Error('no editor');
  }

  const document = editor.document;
  const selection = editor.selection;
  const position = selection.active;

  const text = document.getText();
  const lines = text.split("\n");

  const indent = getLeadingWhitespace(document.lineAt(position.line).text)
  const comment = getCommentPrefix(editor)
  const prefix = indent + comment

  let startLine = position.line;
  while (startLine >= 0 && isComment(prefix, lines[startLine])) {
    startLine--;
  }

  let endLine = position.line;
  while (endLine < lines.length && isComment(prefix, lines[endLine])) {
    endLine++;
  }

  const commentText = lines.slice(startLine, endLine).map(l => trimCommentPrefix(prefix, l)).join(" ");

  return new CommentBlock(
    prefix,
    commentText,
    new vscode.Position(startLine, 0),
    new vscode.Position(endLine-1, getLineLength(document, endLine - 1)),
  )
}

export function wrapCommentText(comment: string, prefix: string, desiredLineLength: number): string {
  let actualLineLength = desiredLineLength - prefix.length
  if (actualLineLength < 0) {
    actualLineLength = 0
  }

  const lines = splitLines(comment, actualLineLength)
  return addCommentPrefix(prefix, lines)
}

function getLineLength(document: vscode.TextDocument, lineNumber: number): number {
  const line = document.lineAt(lineNumber);
  return line.text.length;
}

function isComment(prefix: string, line: string): boolean {
  return line.trim().startsWith(prefix);
}

function addCommentPrefix(prefix: string, lines: string[]): string {
  return lines.map(line => `\n${prefix} ${line}`).join("");
}

function trimCommentPrefix(prefix: string, line: string): string {
  line = line.trim()
  if (line.startsWith(prefix)) {
    return line.slice(prefix.length).trim();
  }

  return line;
}

function splitLines(str: string, maxLength: number): string[] {
  const words = str.split(' ');
  const lines = [];
  let currentLine = '';
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (currentLine.length + word.length >= maxLength) {
      lines.push(currentLine.trim());
      currentLine = '';
    }
    currentLine += `${word} `;
  }
  lines.push(currentLine.trim());

  return lines;
}

function getCommentPrefix(editor: vscode.TextEditor): string {
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

function getLeadingWhitespace(str: string) {
  const leadingWhitespaceRegex = /^(\s+)/;
  const match = str.match(leadingWhitespaceRegex);
  return match ? match[0] : '';
}
