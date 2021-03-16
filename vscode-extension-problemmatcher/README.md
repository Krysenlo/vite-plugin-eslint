# VSCode problemmatcher for [vite-plugin-eslint](https://www.npmjs.com/package/vite-plugin-eslint)

## Install

- You can browse and install extensions from within VS Code.

  Bring up the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of VS Code or the View: Extensions command (Ctrl+Shift+X).

  input `@id:krysenlo.vite-plugin-eslint-problemmatcher` in the search box and press the `Install` button.

- Install from website [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=krysenlo.vite-plugin-eslint-problemmatcher)

- or [Install from a VSIX](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix)

  You can manually install a VS Code extension packaged in a .vsix file. Using the Install from VSIX command in the Extensions view command drop-down, or the Extensions: Install from VSIX command in the Command Palette, point to the .vsix file.

  You can also install using the VS Code --install-extension command-line switch providing the path to the .vsix file.

  ```
  code --install-extension vite-plugin-eslint-problemmatcher*.vsix
  ```

## Features

This extension provide 2 problemmatcher for [vite-plugin-eslint](https://www.npmjs.com/package/vite-plugin-eslint):

- `$vite-eslint-visualstudio`
- `$vite-esbuild`

## Use case

see example in [vite-plugin-eslint](https://github.com/Krysenlo/vite-plugin-eslint)

## Example

`.vscode\tasks.json`

```
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "task-example | vite:dev",
      "detail": "vite",
      "type": "npm",
      "script": "dev",
      "path": "example/",
      "presentation": {
        "echo": true,
        "reveal": "never",
        "revealProblems": "onProblem",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": true
      },
      "isBackground": true,
      "problemMatcher": [
        "$vite-eslint-visualstudio",
        "$vite-esbuild"
      ]
    },
  ]
}
```

## Release Notes

### [0.0.1] - 2021-03-17

#### Added

- 2 problemmatcher for [vite-plugin-eslint](https://www.npmjs.com/package/vite-plugin-eslint):
  - `$vite-eslint-visualstudio`
  - `$vite-esbuild`
