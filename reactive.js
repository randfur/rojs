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
  htmlRead,
} from './render.js';

export function reactiveExample() {
  render(document.getElementById('tree'), tree());
  render(document.getElementById('dogcow'), dogcow());
}

function tree() {
  let model = createObservableJsonProxy({
    a: 2,
    b: 2,
    c: 2,
  });

  // setInterval(() => {
  //   write(model.a, Math.floor(random(3)));
  // }, 900);

  // setInterval(() => {
  //   write(model.b, 2);
  //   console.log('b = 2');
  // }, 2000);

  // setInterval(() => {
  //   write(model.c, Math.floor(random(3)));
  // }, 700);

  return [
    div('tree'),
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

function dogcow() {
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

  setInterval(() => {
    debug.textContent = printObservation(model);
  }, 100);

  return {
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
  };
}
