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

import {Component, render} from '../src/render.js';
import {joinSpace, joinBr, button} from '../src/render-helpers.js';
import {mutate} from '../src/observable-json.js';

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
        button('Add food', () => {
          mutate(this.model.foods, foods => {
            foods.push(new Food());
          });
        }),
      ),
      this.model.foods,
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