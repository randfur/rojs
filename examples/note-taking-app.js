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
  button,
  createObservableJsonProxy,
  htmlMapRead,
  mutate,
  render,
  tag,
} from '../src/rojs.js';

// Model
const notesProxy = createObservableJsonProxy([]);

// Controller
function addNote(noteText) {
  if (noteText === '') {
    return;
  }
  mutate(notesProxy, notes => {
    notes.push(noteText);
  });
}
function deleteNote(index) {
  mutate(notesProxy, notes => {
    notes.splice(index, 1);
  });
}

// View
function consumeAddNoteField() {
  const textInput = document.getElementById('new-note-text');
  addNote(textInput.value);
  textInput.value = '';
  textInput.focus();
}
render(
  document.body,
  [
    // Heading.
    tag('h1', 'Notes'),

    // List of notes.
    htmlMapRead(notesProxy, (note, i) => [
      button('❌', event => deleteNote(i)),
      note,
      tag('br'),
    ]),

    // Add note input field.
    {
      tag: 'input',
      type: 'text',
      id: 'new-note-text',
      events: {
        keyup: event => {
          if (event.code === 'Enter') {
            consumeAddNoteField();
          }
        },
      },
    },
    button('Add', consumeAddNoteField),
  ],
);
