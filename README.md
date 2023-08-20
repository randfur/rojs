# Rojs: Render Observable JSON
Rojs is a toy reactive HTML JavaScript framework inspired by [Solid](https://www.solidjs.com/).

- [GitHub](https://github.com/randfur/rojs)
- [Live examples](https://rojs.dev/examples/)

## Key features

### Render JS defined HTML templates

The entry point to Rojs is the `render(container, template)` function; this instantiates `template` as HTML inside a `container` DOM node.

Unlike most reactive frameworks Rojs declares its HTML templates using vanilla uncompiled JavaScript.

See [reference](#render) for template formats.

### Render example

[Live example](https://rojs.dev/examples/colours.html)

```js
import {render} from './src/rojs.js';

const colours = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
];

render(document.body, [
  { tag: 'h1', textContent: 'Colours' },
  {
    style: { display: 'flex' },
    children: colours.map(colour => ({
      style: {
        backgroundColor: colour,
        padding: '20px',
        fontSize: '20px',
      },
      textContent: colour,
    })),
  },
]);
```

Rendered HTML:
```html
<body>
  <h1>Colours</h1>
  <div style="display: flex;">
    <div style="background-color: red; padding: 20px; font-size: 20px;">red</div>
    <div style="background-color: orange; padding: 20px; font-size: 20px;">orange</div>
    <div style="background-color: yellow; padding: 20px; font-size: 20px;">yellow</div>
    <div style="background-color: green; padding: 20px; font-size: 20px;">green</div>
    <div style="background-color: blue; padding: 20px; font-size: 20px;">blue</div>
    <div style="background-color: purple; padding: 20px; font-size: 20px;">purple</div>
  </div>
</body>
```

### Observable JSON

ObservableJsonProxy is a proxy wrapper for a JSON value. This can be used to watch for changes to the value.

`render()` will watch any proxies used in the template and re-render affected sections of the HTML when their value changes. This is the reactive rendering feature of Rojs.

See [reference](#observablejsonproxy) for all capabilities of the proxy object.

### ObservableJsonProxy example

[Live example](https://rojs.dev/examples/hello-world-observable-json.html)

```js
import {createObservableJsonProxy, isObservableJsonProxy, mutate, read, readWrite, watch, write} from './src/rojs.js';

function main() {
  const textProxy = createObservableJsonProxy('Hello');
  addLog(textProxy); // Log: Proxy

  // read() reads the text inside a proxy.
  addLog(read(textProxy)); // Log: 'Hello'

  // watch() reads the value in a proxy and passes it to the callback.
  // The callback is re-invoked whenever the proxy's value is updated.
  watch(textProxy, text => addLog(text)); // Log: 'Hello'

  // write() sets the value inside a proxy.
  write(textProxy, 'Hello world'); // Log: 'Hello world'
  // This logged the text in the proxy due to the watch() callback above being re-invoked.

  // Render the contents of textProxy and logsProxy and include a button that updates textProxy.
  render(document.body, [
    p(
      'Text: ',
      textProxy,
      {tag: 'br'},
      {
        tag: 'button',
        events: {click(event) { readWrite(textProxy, text => text + '!'); }},
        textContent: 'Add !',
      },
    ),
    p(
      'Logs:',
      {tag: 'pre', textContent: () => read(logsProxy).join('\n')},
    ),
  ]);
}

// Using an ObservableJsonProxy for the logs so it can be rendered reactively.
const logsProxy = createObservableJsonProxy([]);
function addLog(x) {
  console.log(x);
  // mutate() gives you a handle to the value inside a proxy allowing you to mutate it.
  mutate(logsProxy, logs => {
    logs.push(isObservableJsonProxy(x) ? 'Proxy' : x);
  });
}

// You can use helper functions to make your templates more succinct.
function p(...children) {
  return {tag: 'p', children};
}

main();

```

Rendered HTML (prior to button being pressed):
```html
<body>
  <p>
    Text: Hello world<br>
    <button>Add !</button>
  </p>
  <p>
    Logs:
    <pre>Proxy
Hello
Hello
Hello world</pre>
  </p>
</body>
```

## Reference

### `render()`

```ts
function render(container: Node, template: Template);
```

Renders `template` as HTML inside `container`. Uses of `ObservableJsonProxy` inside template will be reactive and automatically update the HTML on change.

#### Supporting types

```ts
type Template =
  null |
  Node |
  string |
  number |
  ObservableJsonProxy |
  Array<Template> |
  () => Template |
  HtmlRead |
  Component |
  ElementTemplate;

interface ElementTemplate {
  tag?: string;
  class?: ReadingValue<string>;
  style?: ReadingValue<{
    [cssProperty: string]: ReadingValue<string>;
  }>;
  events?: { [eventName: String]: (event: Event) => void },
  shadow?: Template;
  children?: Template;
  [attribute: string]: ReadingValue<string>;
}
```

#### Template variants

<table>
<!-- Table headers -->
  <tr>
    <td>Template type</td>
    <td>Description</td>
    <td>Example usage</td>
    <td>Instantiated HTML</td>
  </tr>

<!-- null row -->
  <tr>
<td>

`null`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>

<!-- Node row -->
  <tr>
<td>

`Node`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>

<!-- string | number row -->
  <tr>
<td>

`string | number`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>

<!-- ObservableJsonProxy row -->
  <tr>
<td>

`ObservableJsonProxy`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>

<!-- Array row -->
  <tr>
<td>

Array

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>

<!-- Function row -->
  <tr>
<td>

Function

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>

<!-- HtmlRead row -->
  <tr>
<td>

`HtmlRead`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>

<!-- Component row -->
  <tr>
<td>

`Component`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>

<!-- ElementTemplate row -->
  <tr>
<td>

`ElementTemplate`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
</table>

### ObservableJsonProxy

TODO

## Contributing
See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.

## License
Apache 2.0; see [`LICENSE`](LICENSE) for details.

## Disclaimer
This project is not an official Google project. It is not supported by
Google and Google specifically disclaims all warranties as to its quality,
merchantability, or fitness for a particular purpose.