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

export function render(container: HTMLElement, elementTemplate: Template): NodeTree;

type NodeTree = Array<NodeTree> | Node;

// TODO: Complete.
*/

export function render(container, template) {
  if (typeof template === 'string') {
    return renderString(container, template);
  } else if (isObservableJsonProxy(template)) {
    return renderProxy(container, template);
    // TODO
  } else if (template instanceof Array) {
    return renderArray(container, template);
    // TODO
  } else if (typeof template === 'function') {
    return renderFunction(container, template);
    // TODO
  } else if (template instanceof HtmlRead) {
    return renderRead(container, template);
    // TODO
  } else if (template instanceof HtmlIf) {
    return renderIf(container, template);
    // TODO
  } else if (template instanceof HtmlSwitch) {
    return renderSwitch(container, template);
    // TODO
  } else if (template instanceof HtmlMap) {
    return renderMap(container, template);
    // TODO
  } else {
    console.assert(typeof template === 'object');
    return renderElement(container, template);
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

export function flexRow(...children) {
  return ({
    style: {
      display: 'flex',
      flexDirection: 'row',
    },
    children,
  });
}

export function div(...children) {
  return { children };
}

/*
# Private

TODO: write interface types.
*/

const containerSpanKey = Symbol();

function renderString(container, string) {
  const textNode = document.createTextNode(string);
  container.append(textNode);
  return textNode;
}

function renderProxy(container, proxy) {
  const textNode = document.createTextNode('');
  container.append(textNode);
  watch(proxy, value => {
    textNode.textContent = value;
  });
  return textNode;
}

function renderArray(container, arrayTemplate) {
  const nodes = [];
  for (const template of arrayTemplate) {
    nodes.push(render(container, template));
  }
  return nodes;
}

function renderFunction(container, f) {
  const nodes = [[]];
  watch(f, template => {
    removeNodeTree(nodes);
    nodes[0] = render(container, template);
  });
  return nodes;
}

function renderRead(container, readTemplate) {
  const nodes = [[]];
  watch(readTemplate.readingValue, value => {
    removeNodeTree(nodes);
    nodes[0] = render(container, readTemplate.consumer(value));
  });
  return nodes;
}

function renderIf(container, ifTemplate) {
  // TODO
}

function renderSwitch(container, switchTemplate) {
  // TODO
}

function renderMap(container, mapTemplate) {
  // TODO
}

function renderElement(container, elementTemplate) {
  let {
    tag='div',
    style={},
    // TODO: events={},
    children=[],
    onCreate=null,
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
    case 'onCreate':
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

  onCreate?.(element);

  return element;
}

function removeNodeTree(nodeTree) {
  if (nodeTree instanceof Array) {
    for (const subNodeTree of nodeTree) {
      removeNodeTree(subNodeTree);
    }
  } else {
    nodeTree.parentNode.removeChild(nodeTree);
  }
}
