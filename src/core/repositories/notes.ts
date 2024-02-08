import tracer from '../tracer.js';
import { Note } from '@core/types.js';

export interface INotesRepository {
  byId(noteId: string): Promise<Note | undefined>;
  find(filter?: Partial<Note>): Promise<Note[]>;
  create(note: Note): Promise<Note>;
  update(nodeId: string, note: Partial<Omit<Note, 'noteId'>>): Promise<Note>;
  delete(noteId: string): Promise<void>;
}

export class NotesRepository implements INotesRepository {
  private readonly _notesStore: { [id: string]: Note }

  constructor() {
  this._notesStore = {
    id1: {
      noteId: 'id1',
      userId: 'user1',
      createdAt: Date.now(),
      content: 'Hello World!',
    },
    id2: {
      noteId: 'id2',
      userId: 'user2',
      createdAt: Date.now() - 10000,
      content: 'Hello Old World! Old note.',
    },
  };
}

  async byId(noteId: string) {
    return tracer.trace('notes-repository-by-id', () => {
      return this._notesStore[noteId] ?? undefined;
    });
  }

  async find(filter?: Partial<Note>) {
    return tracer.trace('notes-repository-find', () => {
      if (!filter) {
        return Object.values(this._notesStore);
      }

      return Object.values(this._notesStore).filter((note) =>
        Object.keys(filter).some(
          (key) => note[key as keyof Note] === filter[key as keyof Note],
        ),
      );
    });
  }

  async create(note: Note) {
    return tracer.trace('notes-repository-create', () => {
      this._notesStore[note.noteId] = note;
      return note;
    });
  }

  async update(noteId: string, note: Partial<Omit<Note, 'noteId'>>) {
    return tracer.trace('notes-repository-update', () => {
      const existingNote = this._notesStore[noteId];
      if (!existingNote) {
        throw new Error('Note not found');
      }
      this._notesStore[noteId] = { ...existingNote, ...note };
      return this._notesStore[noteId];
    });
  }

  async delete(noteId: string) {
    return tracer.trace('notes-repository-delete', () => {
      delete this._notesStore[noteId];
    });
  }
}
