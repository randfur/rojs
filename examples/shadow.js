import {render} from '../src/render.js';
import {style, tag} from '../src/render-helpers.js';

render(document.body, {
  shadow: [
    style(`
      .test {
        color: blue;
      }
    `),
    {
      classList: ['test'],
      textContent: 'inside shadow test',
    },
    tag('slot'),
  ],
  children: {
    classList: ['test'],
    textContent: 'outside shadow test',
  },
});