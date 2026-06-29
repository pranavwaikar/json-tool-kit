import * as vscode from 'vscode';

/**
 * Unescapes a JSON-escaped string.
 * This function manually decodes valid JSON escape sequences (\", \\, \/, \b, \f, \n, \r, \t, \uXXXX)
 * and throws a descriptive error for any invalid sequences.
 * 
 * @param text The escaped input string
 * @returns The unescaped string
 */
export function unescapeJSONString(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '\\') {
            if (i + 1 >= text.length) {
                throw new Error('Invalid escape sequence: trailing backslash at the end of selection');
            }
            const next = text[i + 1];
            if (next === 'u') {
                if (i + 5 >= text.length) {
                    throw new Error('Invalid escape sequence: incomplete Unicode escape sequence');
                }
                const hex = text.slice(i + 2, i + 6);
                if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
                    throw new Error(`Invalid Unicode escape sequence: \\u${hex}`);
                }
                result += String.fromCharCode(parseInt(hex, 16));
                i += 5;
            } else {
                switch (next) {
                    case '"': result += '"'; break;
                    case '\\': result += '\\'; break;
                    case '/': result += '/'; break;
                    case 'b': result += '\b'; break;
                    case 'f': result += '\f'; break;
                    case 'n': result += '\n'; break;
                    case 'r': result += '\r'; break;
                    case 't': result += '\t'; break;
                    default:
                        throw new Error(`Invalid escape sequence: \\${next}`);
                }
                i += 1;
            }
        } else {
            result += c;
        }
    }
    return result;
}

/**
 * Reusable helper function to apply a string transformation in the active editor.
 * - Supports multi-cursor editing by processing each selection individually.
 * - If no text is selected (the selection is empty), it defaults to the entire document.
 * - Applies all edits in a single transaction, preserving undo/redo history and cursor positions.
 * - Captures any errors thrown during transformation and reports them to the user.
 * 
 * @param editor The active TextEditor instance
 * @param transform The transformation function to apply to the text
 */
export async function transformActiveText(
    editor: vscode.TextEditor,
    transform: (text: string) => string
): Promise<void> {
    const selections = editor.selections;
    
    // Determine if the user has any active selections containing text
    const hasSelection = selections.length > 0 && selections.some(s => !s.isEmpty);
    
    if (!hasSelection) {
        // Fallback: Operate on the entire document
        const document = editor.document;
        const entireRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
        );
        const originalText = document.getText();
        
        try {
            const newText = transform(originalText);
            if (newText !== originalText) {
                await editor.edit(editBuilder => {
                    editBuilder.replace(entireRange, newText);
                });
            }
        } catch (error: any) {
            vscode.window.showErrorMessage(error.message || 'An error occurred during transformation.');
        }
        return;
    }
    
    // Process all active selections (handles multi-cursor editing correctly)
    try {
        // Dry-run/Map transformation to catch any errors before applying partial edits
        const replacements = selections.map(selection => {
            const originalText = editor.document.getText(selection);
            return {
                selection,
                newText: transform(originalText)
            };
        });
        
        // Apply all edits in a single editor edit transaction
        await editor.edit(editBuilder => {
            for (const { selection, newText } of replacements) {
                editBuilder.replace(selection, newText);
            }
        });
    } catch (error: any) {
        vscode.window.showErrorMessage(error.message || 'An error occurred during transformation.');
    }
}

/**
 * Activation lifecycle hook. Called when the extension is activated.
 */
export function activate(context: vscode.ExtensionContext) {
    
    // 1. JSON String Tools: Escape JSON String
    const escapeCommand = vscode.commands.registerCommand('jsonStringTools.escape', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        
        await transformActiveText(editor, (text) => {
            return JSON.stringify(text).slice(1, -1);
        });
    });

    // 2. JSON String Tools: Unescape JSON String
    const unescapeCommand = vscode.commands.registerCommand('jsonStringTools.unescape', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        
        await transformActiveText(editor, (text) => {
            return unescapeJSONString(text);
        });
    });

    // 3. JSON String Tools: Stringify Selection
    const stringifyCommand = vscode.commands.registerCommand('jsonStringTools.stringify', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        
        await transformActiveText(editor, (text) => {
            return JSON.stringify(text);
        });
    });

    // 4. JSON String Tools: Parse JSON String
    const parseCommand = vscode.commands.registerCommand('jsonStringTools.parse', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        
        await transformActiveText(editor, (text) => {
            try {
                const parsed = JSON.parse(text);
                if (typeof parsed !== 'string') {
                    throw new Error('The parsed value is not a JSON string literal.');
                }
                return parsed;
            } catch (error: any) {
                throw new Error(`Failed to parse JSON string: ${error.message}`);
            }
        });
    });

    // 5. JSON String Tools: Pretty Print JSON
    const prettyCommand = vscode.commands.registerCommand('jsonStringTools.pretty', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        
        await transformActiveText(editor, (text) => {
            try {
                const parsed = JSON.parse(text);
                return JSON.stringify(parsed, null, 2);
            } catch (error: any) {
                throw new Error(`Failed to pretty print JSON: ${error.message}`);
            }
        });
    });

    // 6. JSON String Tools: Minify JSON
    const minifyCommand = vscode.commands.registerCommand('jsonStringTools.minify', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        
        await transformActiveText(editor, (text) => {
            try {
                const parsed = JSON.parse(text);
                return JSON.stringify(parsed);
            } catch (error: any) {
                throw new Error(`Failed to minify JSON: ${error.message}`);
            }
        });
    });

    // Register all commands to the extension context
    context.subscriptions.push(
        escapeCommand,
        unescapeCommand,
        stringifyCommand,
        parseCommand,
        prettyCommand,
        minifyCommand
    );
}

/**
 * Deactivation lifecycle hook. Called when the extension is deactivated.
 */
export function deactivate() {}
