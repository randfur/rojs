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

import {render} from '../src/render.js';
import {createObservableJsonProxy, isObservableJsonProxy, mutate, read, readWrite, watch, write} from '../src/observable-json.js';

const value = createObservableJsonProxy('Hello');
const logs = createObservableJsonProxy([]);

addLog(value);
// Log: Proxy

addLog(read(value));
// Log: 'Hello'

watch(value, value => {
  addLog(value);
});
// Log: 'Hello'

write(value, 'Hello world');
// Log: 'Hello world'
// This re-invoked the callback passed to watch() with the new value.

function addLog(x) {
  console.log(x);
  mutate(logs, logs => {
    logs.push(isObservableJsonProxy(x) ? 'Proxy' : x);
  });
}

function p(...children) {
  return { tag: 'p', children };
}

render(document.body, [
  p(
    'Value: ',
    value,
    { tag: 'br' },
    {
      tag: 'button',
      textContent: 'Add !',
      events: { click: event => readWrite(value, value => value + '!') },
    },
  ),
  p(
    'Logs: ',
    { tag: 'pre', textContent: () => read(logs).join('\n') },
  ),
]);
