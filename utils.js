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

export function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function random(x) {
  return Math.random() * x;
}

export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function coinFlip() {
  return Math.random() > 0.5;
}

export function popKeys(object, keyDefaults) {
  const result = {};
  for (const [key, defaultValue] of Object.entries(keyDefaults)) {
    result[key] = key in object ? object[key] : defaultValue;
    delete object[key];
  }
  return result;
}

export function sum(...values) {
  let result = 0;
  for (let value of values) {
    result += value;
  }
  return result;
}

export function range(n) {
  const result = [];
  for (let i = 0; i < n; ++i) {
    result.push(i);
  }
  return result;
}
