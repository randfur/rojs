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
import {
  lastItem,
} from './utils.js';

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

type FlatTree = Array<FlatTree> | Node;

// TODO: Complete.
*/

export function render(container, template, flatTreeRoot=[], flatTreeParent=flatTreeRoot, flatTreePath=[0], insertBeforeNode=null) {
  if (typeof template === 'string' || typeof template === 'number') {
    renderString(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (isObservableJsonProxy(template)) {
    renderProxy(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (template instanceof Array) {
    renderArray(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (typeof template === 'function') {
    renderFunction(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (template instanceof HtmlRead) {
    renderRead(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (template === null) {
    renderNull(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else {
    console.assert(typeof template === 'object');
    renderElement(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
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

export function htmlIf(readingValue, template) {
  return htmlRead(readingValue, value => value ? template : null);
}

export function htmlSwitch(readingValue, switchTemplate) {
  return htmlRead(readingValue, property => {
    return property in switchTemplate ? switchTemplate[property] : null;
  });
}

export function htmlMap(readingValue, itemTemplateFunction=null) {
  return htmlRead(readingValue, list => itemTemplateFunction ? list.map(itemTemplateFunction) : list);
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

export const br = { tag: 'br' };

/*
# Private

TODO: write interface types.
*/

function renderString(container, string, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  const textNode = document.createTextNode(string);

  const index = lastItem(flatTreePath);
  if (index < flatTreeParent.length) {
    removeFlatTreeDom(flatTreeParent[index]);
    flatTreeParent[index] = textNode;
  } else {
    flatTreeParent.push(textNode);
  }

  container.insertBefore(textNode, insertBeforeNode);
}

function renderProxy(container, proxy, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  const textNode = document.createTextNode('');
  watch(proxy, value => {
    textNode.textContent = value;
  });

  const index = lastItem(flatTreePath);
  if (index < flatTreeParent.length) {
    removeFlatTreeDom(flatTreeParent[index]);
    flatTreeParent[index] = textNode;
  } else {
    flatTreeParent.push(textNode);
  }

  container.insertBefore(textNode, insertBeforeNode);
}

function renderArray(container, arrayTemplate, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  const flatTree = [];

  const index = lastItem(flatTreePath);
  if (index < flatTreeParent.length) {
    removeFlatTreeDom(flatTreeParent[index]);
    flatTreeParent[index] = flatTree;
  } else {
    flatTreeParent.push(flatTree);
  }

  for (let i = 0; i < arrayTemplate.length; ++i) {
    const template = arrayTemplate[i];
    render(container, template, flatTreeRoot, flatTree, flatTreePath.concat(i), insertBeforeNode);
  }
}

function renderFunction(container, f, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  watch(f, (template, runCount) => {
    if (runCount > 1) {
      insertBeforeNode = findNextNode(flatTreeRoot, flatTreePath);
    }
    render(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  });
}

function renderRead(container, readTemplate, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  watch(readTemplate.readingValue, (value, runCount) => {
    if (runCount > 1) {
      insertBeforeNode = findNextNode(flatTreeRoot, flatTreePath);
    }
    render(container, readTemplate.consumer(value), flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  });
}

function renderSwitch(container, switchTemplate) {
  // TODO
}

function renderMap(container, mapTemplate) {
  // TODO
}

function renderNull(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  const index = lastItem(flatTreePath);
  if (index < flatTreeParent.length) {
    removeFlatTreeDom(flatTreeParent[index]);
    flatTreeParent[index] = null;
  } else {
    flatTreeParent.push(null);
  }
}

function renderElement(container, elementTemplate, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
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
  const innerFlatTreeRoot = [];
  for (let i = 0; i < children.length; ++i) {
    render(element, children[i], innerFlatTreeRoot, innerFlatTreeRoot, [i], insertBeforeNode);
  }

  const index = lastItem(flatTreePath);
  if (index < flatTreeParent.length) {
    removeFlatTreeDom(flatTreeParent[index]);
    flatTreeParent[index] = element;
  } else {
    flatTreeParent.push(element);
  }

  container.insertBefore(element, insertBeforeNode);

  onCreate?.(element);
}

function removeFlatTreeDom(flatTree) {
  if (flatTree instanceof Array) {
    for (const subFlatTree of flatTree) {
      removeFlatTreeDom(subFlatTree);
    }
  } else if (flatTree !== null) {
    flatTree.parentNode.removeChild(flatTree);
  }
}

function findNextNode(flatTreeParent, flatTreePath, pathIndex=0) {
  if (pathIndex === flatTreePath.length) {
    return null;
  }
  let index = flatTreePath[pathIndex];
  const node = findNextNode(flatTreeParent[index], flatTreePath, pathIndex + 1);
  if (node) {
    return node;
  }
  for (++index; index < flatTreeParent.length; ++index) {
    const node = findFirstNode(flatTreeParent[index]);
    if (node) {
      return node;
    }
  }
  return null;
}

function findFirstNode(flatTree) {
  if (flatTree instanceof Array) {
    for (const subFlatTree of flatTree) {
      const node = findFirstNode(subFlatTree);
      if (node) {
        return node;
      }
    }
    return null;
  } else {
    console.assert(flatTree instanceof Node || flatTree === null);
    return flatTree;
  }
}
