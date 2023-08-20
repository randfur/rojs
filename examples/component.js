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
  button,
  Component,
  join,
  joinBr,
  joinSpace,
  mutate,
  read,
  render,
} from '../src/rojs.js';

class Kitchen extends Component {
  constructor() {
    super({
      model: {
        name: 'Kitchen bench',
        foods: [],
      },
    });

    this.view = joinBr(
      joinSpace(
        this.model.name,
        button('Add food', event => {
          mutate(this.model.foods, foods => {
            foods.push(new Food());
          });
        }),
      ),
      {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        },
        children: () => join(
          read(this.model.foods),
          {
            style: {
              width: '10px',
              height: '80px',
              backgroundColor: 'teal',
              borderRadius: '5px',
            },
          },
        ),
      },
    );
  }
}

class Food extends Component {
  constructor() {
    super({
      model: String.fromCodePoint(127808 + Math.floor(Math.random() * 64)),
    });
    this.view = {
      tag: 'span',
      style: {
        fontSize: '100px',
      },
      textContent: this.model,
    };
  }
}

function main() {
  render(document.body, new Kitchen());
}

main();