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
  watch,
  isObservableJsonProxy,
} from './observable-json.js';

/*
# Public

import {ReadingValue} from './observable-json.js';

export type Template = ElementTemplate | HtmlIf | HtmlSwitch | HtmlMap;

export interface ElementTemplate {
  tag: string,
  style: ReadingValue<interface {
    [cssProperty: string]: ReadingValue<string>;
  }>;
  children: ReadingValue<Array<Template>>;
  [attribute: string]: ReadingValue<string>;
}

class HtmlIf {
  constructor(condition: ReadingValue<bool>, trueBranch: Template, falseBranch: Template);
  // TODO
}

class HtmlSwitch<T> {
  constructor(value: ReadingValue<T>, interface { [value: T]: ReadingValue<Template> });
  // TODO
}

class HtmlMap<T> {
  constructor(value: ReadingValue<Array<T>>, (value: T) => Template);
  // TODO
}

export function render(container: HTMLElement, elementTemplate: Template);

// TODO: Complete.
*/

export function render(container, template, parentSpan=null) {
  if (parentSpan === null) {
    if (!(containerSpanKey in container)) {
      container[containerSpanKey] = new SpanBranch();
    }
    parentSpan = container[containerSpanKey];
  }

  if (typeof template === 'string') {
    renderString(container, template, parentSpan);
  } else if (isObservableJsonProxy(template)) {
    renderProxy(container, template, parentSpan);
    // TODO
  } else if (template instanceof Array) {
    renderArray(container, template, parentSpan);
    // TODO
  } else if (typeof template === 'function') {
    renderFunction(container, template, parentSpan);
    // TODO
  } else if (template instanceof HtmlRead) {
    renderRead(container, template, parentSpan);
    // TODO
  } else if (template instanceof HtmlIf) {
    renderIf(container, template, parentSpan);
    // TODO
  } else if (template instanceof HtmlSwitch) {
    renderSwitch(container, template, parentSpan);
    // TODO
  } else if (template instanceof HtmlMap) {
    renderMap(container, template, parentSpan);
    // TODO
  } else {
    console.assert(typeof template === 'object');
    renderElement(container, template, parentSpan);
  }
}

class HtmlRead {
  constructor(readingValue, consumer) {
    this.readingValue = readingValue;
    this.consumer = consumer;
  }
}

export function htmlRead(readingValue, consumer) {
  return new HtmlRead(readingValue, consumer);
}

class HtmlIf {
  // TODO
}

class HtmlSwitch {
  // TODO
}

class HtmlMap {
}

export function flexColumn(...children) {
  return ({
    style: {
      display: 'flex',
      flexDirection: 'column',
    },
    children,
  });
}

export function div(...children) {
  return { children };
}

/*
# Private
*/

const containerSpanKey = Symbol();

function renderString(container, string, parentSpan) {
  console.log('renderString', arguments);
  container.append(document.createTextNode(string));
}

function renderProxy(container, proxy, parentSpan) {
  console.log('renderProxy', arguments);
  const textNode = document.createTextNode('');
  container.append(textNode);
  watch(proxy, value => {
    textNode.textContent = value;
  });
}

function renderArray(container, arrayTemplate, parentSpan) {
  console.log('renderArray', arguments);
  for (const template of arrayTemplate) {
    render(container, template);
  }
}

function renderFunction(container, f, parentSpan) {
  console.log('renderFunction', arguments);
  watch(f, template => {
    render(container, template);
  });
  // TODO
}

function renderRead(container, readTemplate, parentSpan) {
  console.log('renderRead', arguments);
  watch(readTemplate.readingValue, value => {
    render(container, readTemplate.consumer(value));
  });
}

function renderIf(container, ifTemplate, parentSpan) {
  console.log('renderIf', arguments);
  // TODO
}

function renderSwitch(container, switchTemplate, parentSpan) {
  console.log('renderSwitch', arguments);
  // TODO
}

function renderMap(container, mapTemplate, parentSpan) {
  console.log('renderMap', arguments);
  // TODO
}

function renderElement(container, elementTemplate, parentSpan) {
  console.log('renderElement', arguments);
  let {
    tag='div',
    style={},
    // TODO: events={},
    children=[],
  } = elementTemplate;

  console.assert(typeof tag === 'string');
  const element = document.createElement(tag);

  watch(style, style => {
    element.removeAttribute('style');
    for (const [property, readingValue] of Object.entries(style)) {
      watch(readingValue, value => {
        if (property.startsWith('-')) {
          element.style.setProperty(property, value);
        } else {
          element.style[property] = value;
        }
      });
    }
  });

  // TODO: events

  for (let [attribute, readingValue] of Object.entries(elementTemplate)) {
    switch (attribute) {
    case 'tag':
    case 'style':
    case 'events':
    case 'children':
      break;
    default:
      watch(readingValue, value => {
        element[attribute] = value
      });
      break;
    }
  }

  if (!(children instanceof Array)) {
    children = [children];
  }
  for (const childTemplate of children) {
    render(element, childTemplate);
  }

  container.append(element);
}

class Span {
  constructor() {
    this.key = Symbol();
  }
}

class SpanLeaf extends Span {
  constructor(size) {
    super();
    this.size = size;
  }

  size() {
    return size;
  }
}

class SpanBranch extends Span {
  constructor() {
    super();
    this.children = [];
  }

  size() {
    let size = 0;
    for (const childSpan of this.children) {
      size += childSpan.size();
    }
    return size;
  }
}
