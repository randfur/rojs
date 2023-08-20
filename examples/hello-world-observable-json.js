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

import {render, createObservableJsonProxy, isObservableJsonProxy, mutate, read, readWrite, watch, write} from '../src/rojs.js';

function main() {
  const textProxy = createObservableJsonProxy('Hello');
  addLog(textProxy); // Log: Proxy

  // read() reads the text inside a proxy.
  addLog(read(textProxy)); // Log: 'Hello'

  // watch() reads the value in a proxy and passes it to the callback.
  // The callback is re-invoked whenever the proxy's value is updated.
  watch(textProxy, text => addLog(text)); // Log: 'Hello'

  // write() sets the value inside a proxy.
  write(textProxy, 'Hello world'); // Log: 'Hello world'
  // This logged the text in the proxy due to the watch() callback above being re-invoked.

  // Render the contents of textProxy and logsProxy and include a button that updates textProxy.
  render(document.body, [
    p(
      'Text: ',
      textProxy,
      {tag: 'br'},
      {
        tag: 'button',
        events: {click(event) { readWrite(textProxy, text => text + '!'); }},
        textContent: 'Add !',
      },
    ),
    p(
      'Logs:',
      {tag: 'pre', textContent: () => read(logsProxy).join('\n')},
    ),
  ]);
}

// Using an ObservableJsonProxy for the logs so it can be rendered reactively.
const logsProxy = createObservableJsonProxy([]);
function addLog(x) {
  console.log(x);
  // mutate() gives you a handle to the value inside a proxy allowing you to mutate it.
  mutate(logsProxy, logs => {
    logs.push(isObservableJsonProxy(x) ? 'Proxy' : x);
  });
}

// You can use helper functions to make your templates more succinct.
function p(...children) {
  return {tag: 'p', children};
}

main();
