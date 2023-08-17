import {render} from '../src/render.js'
import {tag, ul} from '../src/render-helpers.js'

function main() {
  const examples = [
    'component',
    'dog-cow',
    'note-taking-app',
  ];
  render(document.body, [
    tag('h1', 'Rojs examples'),
    ul(
      ...examples.map(example => ({
        tag: 'a',
        href: `${example}.html`,
        textContent: example,
      })),
    ),
  ]);
}

main();