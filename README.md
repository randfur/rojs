# Rojs: Render Observable JSON
Rojs is a toy reactive HTML Javascript framework inspired by [Solid](https://www.solidjs.com/).

See live [examples](https://randfur.github.com/rojs/examples/).

## Example Usage
[Note taking app](https://randfur.github.io/rojs/examples/note-taking-app.html).

```javascript
import {
  createObservableJsonProxy,
  mutate,
} from './rojs/observable-json.js';
import {
  render,
  htmlMapRead,
} from './rojs/render.js';

// Model
const notesProxy = createObservableJsonProxy([]);

// Controller
function addNote(noteText) {
  if (noteText === '') {
    return;
  }
  mutate(notesProxy, notes => {
    notes.push(noteText);
  });
}
function deleteNote(index) {
  mutate(notesProxy, notes => {
    notes.splice(index, 1);
  });
}

// View
function button(text, click) {
  return {
    tag: 'button',
    textContent: text,
    events: { click },
  };
}
function consumeAddNoteField() {
  const textInput = document.getElementById('new-note-text');
  addNote(textInput.value);
  textInput.value = '';
  textInput.focus();
}
render(
  document.body,
  [
    // Heading.
    { tag: 'h1', textContent: 'Notes' },

    // List of notes.
    htmlMapRead(notesProxy, (note, i) => [
      button('🞭', event => deleteNote(i)),
      note,
      { tag: 'br' },
    ]),

    // Add note input field.
    {
      tag: 'input',
      type: 'text',
      id: 'new-note-text',
      events: {
        keyup: event => {
          if (event.code === 'Enter') {
            consumeAddNoteField();
          }
        },
      },
    },
    button('Add', consumeAddNoteField),
  ],
);
```

This generates HTML like:
```html
<body>
  <h1>Notes</h1>
  <button>🞭</button>Note 1<br>
  <button>🞭</button>Note 2<br>
  <button>🞭</button>Note 3<br>
  <input type="text" id="new-note-text"><button>Add</button>
</body>
```

## Key features

### HTML templating without the HTML.
The templating engine uses native JavaScript data types.

A Rojs HTML template is one of:
- `null`: Renders nothing.
  ```javascript
  render(container, null);
  ```
  =>
  ```html
  <div id="container"></div>
  ```

- string/number: Rendered as plain text.
  ```javascript
  render(container, 'Test');
  ```
  =>
  ```html
  <div id="container">Test</div>
  ```

- `ObservableJsonProxy`: Renders a string/number inside the `ObservableJsonProxy`, re-renders whenever it changes.
  ```javascript
  const modelProxy = createObservableJsonProxy('Original');
  render(container, modelProxy);
  write(modelProxy, 'Updated');
  ```
  =>
  ```html
  <div id="container">Updated</div>
  ```

- `Array` (of templates): Renders each child template as siblings of each other including nested arrays, this has the effect of flattening a template array tree in the DOM.
  ```javascript
  const modelProxy = createObservableJsonProxy({
    dog: { count: 3 },
    cat: { count: 2 },
    pony: { count: 1 },
  });
  const animals = ['dog', 'cat', 'pony'];
  const br = { tag: 'br' };
  render(container, animals.map(animal => [
    animal,
    ' count: ',
    modelProxy[animal].count,
    br,
  ]));
  readWrite(modelProxy.pony.count, ponyCount => ponyCount + 5);
  ```
  =>
  ```html
  <div id="container">
    dog count: 3<br>
    cat count: 2<br>
    pony count: 6<br>
  </div>
  ```

- `Function`: Renders the template returned by the function. If the function read any ObservableJsonProxies and they change then the function will be re-rendered.
  ```javascript
  const modelProxy = createObservableJsonProxy({
    dog: { count: 3 },
    cat: { count: 2 },
    pony: { count: 1 },
  });
  const animals = ['dog', 'cat', 'pony'];
  function sum(list) {
    return list.reduce((a, b) => a + b);
  }
  render(container, [
    'Total animal count: ',
    () => sum(animals.map(animal => read(modelProxy[animal].count))),
  ];
  readWrite(modelProxy.pony.count, ponyCount => ponyCount + 5);
  ```
  =>
  ```html
  <div id="container">Total animal count: 11</div>
  ```

- `HtmlRead` instance: This type is an implementation detail and never explicitly created by users of Rojs, instead one of the following helper functions is used instead:
  - `htmlRead(value, consumer)`: Short for `new HtmlRead(value, consumer)`.
  - `htmlIf(condition, template)`:
  - `htmlSwitch(value, templateRoutes)`:
  - `htmlMap`:
  - `htmlMapRead`:

- Element object: A raw JavaScript object containing a `tag`, `style`, `events`, `children` sub templates and any other standard Element attribute.

### Deeply nested data binding.

### Direct re-rendering, no virtual DOM.

### Experimental. Not production ready. Probably performs terribly and hard to use at scale.

## Rojs vs Solid
The key design differences to Solid are:
- Instead of Signal it has `ObservableJsonProxy`; this functions similarly but is a JSON value which can be observed at any point in the JSON tree.
- Instead of HTML syntax it uses pure JavaScript to define UI templates.
- Instead of Effects it has `watch()` which takes two parameters; one that `read()`s ObservableJsonProxies and one that consumes the result. The read+consume action is repeated whenever one of the `read()` ObservableJsonProxies changes.

## Contributing
See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.

## License
Apache 2.0; see [`LICENSE`](LICENSE) for details.

## Disclaimer
This project is not an official Google project. It is not supported by
Google and Google specifically disclaims all warranties as to its quality,
merchantability, or fitness for a particular purpose.