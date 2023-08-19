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

import {join} from './utils.js';

export function flexColumn(...children) {
  return {
    style: {
      display: 'flex',
      flexDirection: 'column',
    },
    children,
  };
}

export function tag(tag, ...children) {
  return {tag, children};
}

export function button(text, click) {
  return {
    tag: 'button',
    textContent: text,
    events: {click},
  };
}

export function flexRow(...children) {
  return {
    style: {
      display: 'flex',
      flexDirection: 'row',
    },
    children,
  };
}

export function div(...children) {
  return {children};
}

export const br = {tag: 'br'};

export function style(stylesheetText) {
  return {
    tag: 'style',
    textContent: stylesheetText,
  };
}

export function joinSpace(...children) {
  return join(children, ' ');
}

export function joinBr(...children) {
  return join(children, br);
}

export function ol(...children) {
  return {
    tag: 'ol',
    children: children.map(child => ({
      tag: 'li',
      children: child,
    })),
  };
}

export function ul(...children) {
  return {
    tag: 'ul',
    children: children.map(child => ({
      tag: 'li',
      children: child,
    })),
  };
}