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
  array,
  sleep,
  random,
  coinFlip,
  range,
} from './utils.js';
import {
  createObservableJsonProxy,
  read,
  write,
  mutate,
  printObservation,
} from './observable-json.js';
import {
  render,
  div,
  flexRow,
  htmlRead,
} from './render.js';

export function reactiveExample() {
  render(
    document.body,
    flexRow(
      div(flatTree()),
      div(dogCow()),
    ),
  );
}

function flatTree() {
  let model = createObservableJsonProxy({
    a: 2,
    b: 2,
    c: 2,
  });

  setInterval(() => {
    write(model.a, Math.ceil(random(4)));
  }, 1100);

  setInterval(() => {
    write(model.b, Math.ceil(random(4)));
  }, 1200);

  setInterval(() => {
    write(model.c, Math.ceil(random(4)));
  }, 1300);

  return [
    div('Flat tree'),
    div(array`Branching values: ${model.a}, ${model.b}, ${model.c}`),
    div(htmlRead(model.a, a => {
      return range(a).map(i => {
        return htmlRead(model.b, b => {
          return range(b).map(j => {
            return htmlRead(model.c, c => {
              return range(c).map(k => {
                return div(`a:${i} b:${j} c:${k}`);
              });
            });
          });
        });
      });
    })),
  ];
}

function dogCow() {
  let model = createObservableJsonProxy({
    mode: 'dog',
    dog: {
      emoji: '🐶',
      value: 30,
    },
    cow: {
      emoji: '🐄',
      value: 0,
    },
  });

  setInterval(() => {
    write(model.mode, coinFlip() ? 'dog' : 'cow');
  }, 3100);

  setInterval(() => {
    write(model.dog.value, 20 + random(20));
  }, 700);

  setInterval(() => {
    write(model.cow.value, random(100));
  }, 600);

  return [
    'Dog cow',
    {
      style: () => {
        const mode = read(model.mode);
        const valueProxy = model[mode].value;
        const result = {
          height: '40px',
        };
        if (mode === 'dog') {
          result.fontSize = () => `${read(valueProxy)}px`;
        } else {
          result.fontSize = '20px';
          result.marginLeft = () => `${read(valueProxy)}px`;
        }
        return result;
      },
      textContent: () => read(model[read(model.mode)].emoji),
    },
    {
      tag: 'pre',
      onCreate(element) {
        setInterval(() => {
          element.textContent = printObservation(model);
        }, 100);
      }
    },
  ];
}
