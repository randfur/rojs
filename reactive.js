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
  coinFlip,
  join,
  random,
  range,
  sleep,
  enumerate,
} from './utils.js';
import {
  createObservableJsonProxy,
  mutate,
  printObservation,
  read,
  write,
} from './observable-json.js';
import {
  br,
  div,
  flexRow,
  htmlRead,
  htmlIf,
  htmlSwitch,
  htmlMap,
  render,
} from './render.js';

export function reactiveExample() {
  render(
    document.body,
    flexRow(
      div(resizingSiblings()),
      div(dogCow()),
      div(dogCat()),
    ),
  );
}

function dogCat() {
  const model = createObservableJsonProxy({
    mode: 'dog',
    dogData: {
      barkbark: true,
      walkies: true,
    },
    catData: {
      meowmeow: true,
      mice: [],
    },
  });

  setInterval(() => {
    write(model.mode, coinFlip() ? 'dog' : 'cat');
  }, 2000);

  setInterval(() => {
    write(model.dogData.walkies, Math.round(random(4)));
  }, 1500);
  setInterval(() => {
    write(model.dogData.barkbark, coinFlip());
  }, 500);

  setInterval(() => {
    write(model.catData.meowmeow, coinFlip());
  }, 800);
  setInterval(() => {
    write(model.catData.mice, range(Math.round(random(4))).map(i => coinFlip()));
  }, 1600);

  return {
    style: {
      fontSize: '60px',
    },
    children: htmlSwitch(model.mode, {
      dog: [
        '🐶',
        htmlIf(model.dogData.barkbark, '💬Bark bark!'),
        br,
        htmlRead(model.dogData.walkies, walkies => '🐾'.repeat(walkies)),
      ],
      cat: [
        '🐱',
        htmlIf(model.catData.meowmeow, '💬Meow meow.'),
        br,
        htmlMap(model.catData.mice, mouse => mouse ? '🐀' : '🐁'),
      ],
    }),
  };
}

function resizingSiblings() {
  const colours = ['red', 'yellow', 'lime', 'blue'];

  const model = createObservableJsonProxy(
    Object.fromEntries(
      colours.map(colour => [colour, 3])
    )
  );

  for (const [i, colour] of enumerate(colours)) {
    setInterval(() => {
      write(model[colour], Math.round(random(3)));
    }, 1000 + i * 100);
  }

  const colourBlockStyle = {
    margin: '1px',
    width: '20px',
    height: '20px',
    textAlign: 'center',
    color: 'black',
  };

  return {
    style: { width: '200px' },
    children: [
      join([
        'Resizing siblings',
        'Values: ',
        ...colours.map(colour => array`- ${colour}: ${model[colour]}`),
      ], br),
      colours.map(
        colour => htmlRead(
          model[colour],
          count => range(count).map(
            i => ({
              style: {
                ...colourBlockStyle,
                backgroundColor: colour,
              },
              textContent: i,
            })
          )
        )
      ),
    ],
  };
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
