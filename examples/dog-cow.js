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
} from '../src/utils.js';
import {
  createObservableJsonProxy,
  mutate,
  printObservation,
  read,
  write,
} from '../src/observable-json.js';
import {
  render,
  htmlRead,
  htmlIf,
  htmlSwitch,
  htmlMapRead,
} from '../src/render.js';
import {
  br,
  div,
  flexRow,
} from '../src/render-helpers.js';

async function main() {
  render(
    document.body,
    flexRow(
      div(resizingSiblings()),
      div(dogCow()),
      div(dogCat()),
    ),
  );
}

function resizingSiblings() {
  const colours = ['red', 'yellow', 'lime', 'blue'];

  const modelProxy = createObservableJsonProxy(
    Object.fromEntries(
      colours.map(colour => [colour, 3])
    )
  );

  for (const [i, colour] of enumerate(colours)) {
    setInterval(() => {
      write(modelProxy[colour], Math.round(random(3)));
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
        ...colours.map(colour => array`- ${colour}: ${modelProxy[colour]}`),
      ], br),
      colours.map(
        colour => htmlRead(
          modelProxy[colour],
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
  let modelProxy = createObservableJsonProxy({
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
    write(modelProxy.mode, coinFlip() ? 'dog' : 'cow');
  }, 3100);

  setInterval(() => {
    write(modelProxy.dog.value, 20 + random(20));
  }, 700);

  setInterval(() => {
    write(modelProxy.cow.value, random(100));
  }, 600);

  return [
    'Dog cow',
    {
      style: () => {
        const mode = read(modelProxy.mode);
        const valueProxy = modelProxy[mode].value;
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
      textContent: () => read(modelProxy[read(modelProxy.mode)].emoji),
    },
    {
      tag: 'pre',
      onAttach(element) {
        setInterval(() => {
          element.textContent = printObservation(modelProxy);
        }, 100);
      }
    },
  ];
}

function dogCat() {
  const modelProxy = createObservableJsonProxy({
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
    write(modelProxy.mode, coinFlip() ? 'dog' : 'cat');
  }, 2000);

  setInterval(() => {
    write(modelProxy.dogData.walkies, Math.round(random(4)));
  }, 700);
  setInterval(() => {
    write(modelProxy.dogData.barkbark, coinFlip());
  }, 500);

  setInterval(() => {
    write(modelProxy.catData.meowmeow, coinFlip());
  }, 800);
  setInterval(() => {
    write(modelProxy.catData.mice, range(Math.round(random(4))).map(i => coinFlip()));
  }, 600);

  return {
    style: {
      fontSize: '60px',
    },
    children: htmlSwitch(modelProxy.mode, {
      dog: [
        '🐶',
        htmlIf(modelProxy.dogData.barkbark, '💬Bark bark!'),
        br,
        htmlRead(modelProxy.dogData.walkies, walkies => '🐾'.repeat(walkies)),
      ],
      cat: [
        '🐱',
        htmlIf(modelProxy.catData.meowmeow, '💬Meow meow.'),
        br,
        htmlMapRead(modelProxy.catData.mice, mouse => mouse ? '🐀' : '🐁'),
      ],
    }),
  };
}

main();
