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