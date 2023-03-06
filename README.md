# Render Observable JSON

This is a toy reactive HTML Javascript framework inspired by [Solid](https://www.solidjs.com/).

The key differences to Solid are:
- Instead of Signal it has ObservableJsonProxy; this functions similarly but is a JSON value which can be observed at any point in the JSON tree.
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