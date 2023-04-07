import {
  createObservableJsonProxy,
  mutate,
} from '../src/observable-json.js';
import {
  render,
  htmlMapRead,
} from '../src/render.js';

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
function button(text, click) {
  return {
    tag: 'button',
    textContent: text,
    events: { click },
  };
}
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
    { tag: 'h1', textContent: 'Notes' },

    // List of notes.
    htmlMapRead(notesProxy, (note, i) => [
      button('❌', event => deleteNote(i)),
      note,
      { tag: 'br' },
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
