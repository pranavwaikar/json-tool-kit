# JSON Tool Kit

JSON Tool Kit is a lightweight, high-performance Visual Studio Code extension that helps developers quickly escape, unescape, stringify, parse, pretty-print, and minify JSON strings directly within the editor. 

With full support for multi-cursor editing, custom selection areas, and full-document fallback, this extension integrates seamlessly into your formatting and refactoring workflows without any external dependencies.

---

## Features

- **Escape JSON String**: Convert text into a JSON-escaped string without surrounding quotes.
- **Unescape JSON String**: Reverse escaping on text (supporting unicode, newlines, tabs, quotes, backslashes) with graceful syntax error reporting.
- **Stringify Selection**: Convert text into a valid JSON string literal (including surrounding quotes).
- **Parse JSON String**: Parse a JSON string literal (including surrounding quotes) back to raw text.
- **Pretty Print JSON**: Format raw JSON strings with 2-space indentation.
- **Minify JSON**: Remove all unnecessary whitespace from JSON.
- **Multi-Cursor Support**: Process multiple selections concurrently.
- **Zero Dependencies**: Lightweight footprint, targetting the latest VS Code API.

---

## Installation

1. Open **Visual Studio Code**.
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`).
3. Search for **JSON Tool Kit**.
4. Click **Install**.

*Alternatively, you can install the extension from the command line:*
```bash
code --install-extension pranavwaikar.json-tool-kit
```

---

## Usage

Select the text you want to transform (or clear selection to operate on the entire document), open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), and run one of the following commands:

### GIF Placeholder: Extension In Action
![JSON Tool Kit Demo](https://raw.githubusercontent.com/pranavwaikar/json-tool-kit/main/images/demo.gif)

---

## Command List & Examples

| Command ID | Title | Description / Behavior |
| :--- | :--- | :--- |
| `jsonStringTools.escape` | **JSON String Tools: Escape JSON String** | Escapes special characters like `"` and `\n` without wrapping in quotes. |
| `jsonStringTools.unescape` | **JSON String Tools: Unescape JSON String** | Decodes escape sequences like `\"` and `\n` back to normal text. |
| `jsonStringTools.stringify` | **JSON String Tools: Stringify Selection** | Turns the selection into a valid double-quoted JSON string literal. |
| `jsonStringTools.parse` | **JSON String Tools: Parse JSON String** | Parses a quoted JSON string literal back to raw text. |
| `jsonStringTools.pretty` | **JSON String Tools: Pretty Print JSON** | Formats valid JSON with 2-space indentation. |
| `jsonStringTools.minify` | **JSON String Tools: Minify JSON** | Compresses valid JSON by stripping whitespaces. |

### Command Examples

#### 1. Escape JSON String
* **Input**:
  ```text
  Hello "World"
  Line 2
  ```
* **Output**:
  ```text
  Hello \"World\"\nLine 2
  ```

#### 2. Unescape JSON String
* **Input**:
  ```text
  Hello \"World\"\nLine 2
  ```
* **Output**:
  ```text
  Hello "World"
  Line 2
  ```

#### 3. Stringify Selection
* **Input**:
  ```text
  Hello "World"
  ```
* **Output**:
  ```text
  "Hello \"World\""
  ```

#### 4. Parse JSON String
* **Input**:
  ```text
  "Hello\nWorld"
  ```
* **Output**:
  ```text
  Hello
  World
  ```

#### 5. Pretty Print JSON
* **Input**:
  ```json
  {"name":"JSON Tool Kit","active":true}
  ```
* **Output**:
  ```json
  {
    "name": "JSON Tool Kit",
    "active": true
  }
  ```

#### 6. Minify JSON
* **Input**:
  ```json
  {
    "name": "JSON Tool Kit",
    "active": true
  }
  ```
* **Output**:
  ```json
  {"name":"JSON Tool Kit","active":true}
  ```

---

## Development

To develop and test the extension locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/pranavwaikar/json-tool-kit.git
   cd json-tool-kit
   ```
2. Install development dependencies:
   ```bash
   npm install
   ```
3. Compile the TypeScript files:
   ```bash
   npm run compile
   ```
4. Open the project in VS Code:
   ```bash
   code .
   ```
5. Press `F5` to start a new Extension Development Host window.
6. Open any file in the new window, select text, and test the commands.

---

## Publishing

To package and publish the extension to the VS Code Marketplace:

1. Install `@vscode/vsce` globally:
   ```bash
   npm install -g @vscode/vsce
   ```
2. Package the extension (generates a `.vsix` bundle):
   ```bash
   vsce package
   ```
3. Publish to the Marketplace:
   ```bash
   vsce publish
   ```
   *Note: You will need a Personal Access Token (PAT) from Azure DevOps to publish.*

---

## License

This project is licensed under the [MIT License](LICENSE).
