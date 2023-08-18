# Rojs: Render Observable JSON
Rojs is a toy reactive HTML JavaScript framework inspired by [Solid](https://www.solidjs.com/).

- [GitHub](https://github.com/randfur/rojs)
- [Live examples](https://rojs.dev/examples/)

## Key features

### Render JS defined HTML templates

The entry point to Rojs is the `render(container, template)` function; this instantiates `template` as HTML inside a `container` DOM node.

Unlike most reactive frameworks Rojs declares its HTML templates using pure JavaScript.

See [reference](#render) for template formats.

```js
render(document.body, 'Hello world');
```
[Live example](https://rojs.dev/examples/hello-world-render.html)

```js
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

/*
Rendered HTML:
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
*/
```
[Live example](https://rojs.dev/examples/colours.html)


### Observable JSON

ObservableJsonProxy is a proxy wrapper for a JSON value. This can be used to watch for changes to the value. See [reference](#observablejsonproxy) for usage of the proxy object.

```js
import {createObservableJsonProxy, read, watch, write} from './src/observable-json.js';

const value = createObservableJsonProxy('Hello');

console.log(value);
// Console: Proxy

console.log(read(value));
// Console: 'Hello'

watch(value, value => {
  console.log(value);
});
// Console: 'Hello'

write(value, 'world');
// Console: 'world'
// This re-invoked the callback passed to watch() with the new value.
```
[Live example](https://rojs.dev/examples/hello-world-observable-json.html)

### Reactive rendering

TODO

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
  <tr>
    <td>Template type</td>
    <td>Description</td>
    <td>Example usage</td>
    <td>Instantiated HTML</td>
  </tr>
  <tr>
<td>

`null`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
  <tr>
<td>

`Node`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
  <tr>
<td>

`string | number`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
  <tr>
<td>

`ObservableJsonProxy`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
  <tr>
<td>

`Array<Template>`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
  <tr>
<td>

`() => Template`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
  <tr>
<td>

`HtmlRead`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
  <tr>
<td>

`Component`

</td>
    <td>TODO</td>
    <td>TODO</td>
    <td>TODO</td>
  </tr>
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