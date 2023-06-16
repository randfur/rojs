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
  range,
} from './utils.js';

/*
# Public

import {ReadingValue} from './observable-json.js';

export type Template = null | number | string | Array<Template> | ElementTemplate | HtmlRead | () => Template;

export interface ElementTemplate {
  tag: string,
  style: ReadingValue<{
    [cssProperty: string]: ReadingValue<string>;
  }>;
  children: Array<Template>;
  [attribute: string]: ReadingValue<string>;
}

export function render(container: Node, template: Template);

export function htmlRead<T>(readingValue: ReadingValue<T>, (value: T) => Template): HtmlRead;
export function htmlIf(readingValue: ReadingValue<boolean>, Template): HtmlRead;
export function htmlSwitch(readingValue: ReadingValue<T>, { [branch: T]: Template }): HtmlRead;
export function htmlMap(readingValue: ReadingValue<Array<T>>, (proxy: ObservableJsonProxy) => Template): HtmlRead;
export function htmlMapRead(readingValue: ReadingValue<Array<T>>, (value: T) => Template): HtmlRead;
*/

export {array} from './utils.js';

export function render(container, template) {
  const flatTreeRoot = [];
  renderImpl(container, template, flatTreeRoot, flatTreeRoot, [0], null);
}

export function htmlRead(readingValue, consumer) {
  return new HtmlRead(readingValue, consumer);
}

export function htmlIf(readingValue, trueTemplate, falseTemplate=null) {
  return htmlRead(readingValue, value => value ? trueTemplate : falseTemplate);
}

export function htmlSwitch(readingValue, switchTemplate) {
  return htmlRead(readingValue, property => {
    return property in switchTemplate ? switchTemplate[property] : null;
  });
}

export function htmlMap(listProxy, itemTemplateFunction) {
  return htmlRead(listProxy, list => {
    return range(list.length).map(i => itemTemplateFunction(listProxy[i], i));
  });
}

export function htmlMapRead(listProxy, itemTemplateFunction) {
  return htmlRead(listProxy, list => {
    return range(list.length).map(i => htmlRead(listProxy[i], item => itemTemplateFunction(item, i)));
  });
}

/*
# Private

class HtmlRead<T> {
  readingValue: ReadingValue<T>;
  consumer: (value: T) => template;

  constructor(readingValue: ReadingValue<T>, consumer: (value: T) => template);
}

type FlatTree = Array<FlatTree> | Node | null;

function renderImpl(container: Node, template: Template, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);
function renderInsertNode(container: Node, node: Node, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);
function renderString(container: Node, template: string | number, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);
function renderProxy(container: Node, template: ObservableJsonProxy, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);
function renderArray(container: Node, template: Array<Template>, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);
function renderFunction(container: Node, template: () => Template, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);
function renderRead(container: Node, template: HtmlRead, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);
function renderNull(container: Node, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);
function renderElement(container: Node, template: ElementTemplate, flatTreeRoot: FlatTree, flatTreeParent: FlatTree, flatTreePath: Array<number>, insertBeforeNode: Node | null);

const kFlatTreeParent: Symbol;
const kFlatTreeIndex: Symbol;

function setInFlatTree(flatTreeParent: FlatTree, flatTreePath: Array<number>, flatTree: FlatTree) {
function removeFlatTreeDom(flatTree: FlatTree);
function findNextNode(flatTreeParent: FlatTree, flatTreePath: Array<number>, pathIndex: number): Node | null;
function findFirstNode(flatTree): Node | null;
*/

class HtmlRead {
  constructor(readingValue, consumer) {
    this.readingValue = readingValue;
    this.consumer = consumer;
  }
}

function renderImpl(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  if (template === null) {
    renderNull(container, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (template instanceof Node) {
    renderInsertNode(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode)
  } else if (typeof template === 'string' || typeof template === 'number') {
    renderString(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (isObservableJsonProxy(template)) {
    renderProxy(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (template instanceof Array) {
    renderArray(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (typeof template === 'function') {
    renderFunction(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else if (template instanceof HtmlRead) {
    renderRead(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  } else {
    console.assert(typeof template === 'object');
    renderElement(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  }
}

function renderInsertNode(container, node, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  setInFlatTree(flatTreeParent, flatTreePath, node);
  container.insertBefore(node, insertBeforeNode);
}

function renderString(container, string, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  renderInsertNode(container, document.createTextNode(string), flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
}

function renderProxy(container, proxy, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  const textNode = document.createTextNode('');
  watch(proxy, value => {
    textNode.textContent = value;
  });

  renderInsertNode(container, textNode, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
}

function renderArray(container, arrayTemplate, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  const flatTree = [];
  setInFlatTree(flatTreeParent, flatTreePath, flatTree);

  for (let i = 0; i < arrayTemplate.length; ++i) {
    const template = arrayTemplate[i];
    renderImpl(container, template, flatTreeRoot, flatTree, flatTreePath.concat(i), insertBeforeNode);
  }
}

function renderFunction(container, f, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  watch(f, (template, runCount) => {
    if (runCount > 1) {
      insertBeforeNode = findNextNode(flatTreeRoot, flatTreePath);
    }
    renderImpl(container, template, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  });
}

function renderRead(container, readTemplate, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  watch(readTemplate.readingValue, (value, runCount) => {
    if (runCount > 1) {
      insertBeforeNode = findNextNode(flatTreeRoot, flatTreePath);
    }
    renderImpl(container, readTemplate.consumer(value), flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);
  });
}

function renderNull(container, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  setInFlatTree(flatTreeParent, flatTreePath, null);
}

function renderElement(container, elementTemplate, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode) {
  let {
    tag='div',
    style={},
    events={},
    children=[],
    onAttach=null,
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

  for (const [eventName, eventHandler] of Object.entries(events)) {
    element.addEventListener(eventName, eventHandler);
  }

  for (const [attribute, readingValue] of Object.entries(elementTemplate)) {
    switch (attribute) {
    case 'tag':
    case 'style':
    case 'events':
    case 'children':
    case 'onAttach':
      break;
    default:
      watch(readingValue, value => {
        element[attribute] = value;
      });
      break;
    }
  }

  if (!(children instanceof Array)) {
    children = [children];
  }
  const innerFlatTreeRoot = [];
  for (let i = 0; i < children.length; ++i) {
    renderImpl(element, children[i], innerFlatTreeRoot, innerFlatTreeRoot, [i], insertBeforeNode);
  }

  renderInsertNode(container, element, flatTreeRoot, flatTreeParent, flatTreePath, insertBeforeNode);

  onAttach?.(element);
}

const kFlatTreeParent = Symbol();
const kFlatTreeIndex = Symbol();

function setInFlatTree(flatTreeParent, flatTreePath, flatTree) {
  if (flatTree instanceof Node) {
    // If the node was already in a flatTree, null out its old place so it
    // doesn't get removed by whatever goes there later.
    const {
      [kFlatTreeParent]: existingParent,
      [kFlatTreeIndex]: existingIndex,
    } = flatTree;
    if (existingParent) {
      existingParent[existingIndex] = null;
    }
  }

  const index = lastItem(flatTreePath);
  if (index < flatTreeParent.length) {
    removeFlatTreeDom(flatTreeParent[index]);
    flatTreeParent[index] = flatTree;
  } else {
    flatTreeParent.push(flatTree);
  }

  if (flatTree instanceof Node) {
    // Tell the node where it is in the flatTree so it can null itself later in
    // the above code.
    flatTree[kFlatTreeParent] = flatTreeParent;
    flatTree[kFlatTreeIndex] = index;
  }
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
