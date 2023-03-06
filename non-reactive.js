/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  sleep,
  random,
  pickRandom,
  coinFlip,
  popKeys,
  sum,
} from './utils.js';

export function nonReactiveExample() {
  let model = {
    dogs: [
      { barks: 1 },
      { barks: 2 },
      { barks: 3 },
    ],
    cow: 'moo',
  };

  (async () => {
    while (true) {
      await sleep(1000 + random(3000));
      pickRandom(model.dogs).barks += coinFlip() ? 1 : -1;
    }
  })();

  return flexColumn(
    group(`there are ${sum(...model.dogs.map(({barks}) => barks))} dog bark`),
    ...model.dogs.map(({barks}) => group(`🐶 ${'bark '.repeat(barks)}`)),
    group(`cow go ${model.cow}`),
  );
}

function createElement(params) {
  const {tag, style, events, children} = popKeys(params, {
    tag: 'div',
    style: {},
    events: {},
    children: [],
  });
  const element = document.createElement(tag);
  for (const [property, value] of Object.entries(style)) {
    if (property.startsWith('-')) {
      element.style.setProperty(property, value);
    } else {
      element.style[property] = value;
    }
  }
  for (const [eventName, handler] of Object.entries(events)) {
    element.addEventListener(eventName, handler);
  }
  for (const [key, value] of Object.entries(params)) {
    element[key] = value;
  }
  element.append(...children);
  return element;
}

function flexColumn(...children) {
  return createElement({
    style: {
      display: 'flex',
      flexDirection: 'column',
    },
    children,
  });
}

function group(...children) {
  return createElement({children});
}
