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

import {createObservableJsonProxy, isObservableJsonProxy, read, watch, write} from '../src/observable-json.js';

function log(x) {
  console.log(x);
  document.querySelector('#output').textContent += (isObservableJsonProxy(x) ? 'Proxy' : x)  + '\n';
}

const value = createObservableJsonProxy('Hello');

log(value);
// Console: Proxy

log(read(value));
// Console: 'Hello'

watch(value, value => {
  log(value);
});
// Console: 'Hello'

write(value, 'world');
// Console: 'world'
