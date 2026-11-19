# Interactive To-Do List with LocalStorage

A responsive task manager built with HTML, CSS, and vanilla JavaScript. Tasks are stored in the browser using `localStorage`, so they remain available after a page refresh.

## Features

- Add tasks (Enter key or Add task button)
- Mark tasks as completed and active again
- Delete individual tasks
- Filter tasks by All, Active, and Done
- Clear all completed tasks
- Remaining-task count and completion progress bar
- Persistent browser storage with safe JSON parsing
- Responsive layout for desktop and mobile
- User-entered task text is rendered with `textContent` (not `innerHTML`)

## Project files

- `index.html` — page structure
- `style.css` — responsive styling
- `app.js` — task state, DOM rendering, events, and LocalStorage

## Run locally

1. Open this folder in Visual Studio Code.
2. Open `index.html` with the VS Code Live Server extension, or open the file directly in a browser.
3. Add a few tasks and refresh the page to verify persistence.

No build step or package installation is required.

## Storage

The app stores its task array under the LocalStorage key `interactive-todo-tasks`. Each task has an `id`, `text`, and `done` property.

Example:

```js
{ id: "unique-id", text: "Finish project", done: false }
```

To inspect saved data, open browser developer tools → Application (or Storage) → Local Storage.

## Notes

LocalStorage is specific to the browser and origin being used. Tasks do not automatically sync between devices or browsers.
