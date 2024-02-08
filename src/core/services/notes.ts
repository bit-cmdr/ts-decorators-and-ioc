import tracer from '../tracer.js';
import logger from '@core/logger.js';
import { INotesRepository } from '@core/repositories/notes.js';
import { Note } from '@core/types.js';

export interface INotesService {
  byId(noteId: string): Promise<Note | undefined>;
  notesByUserId(userId: string): Promise<Note[]>;
  all(): Promise<Note[]>;
  create(note: Omit<Note, 'noteId' | 'createdAt'>): Promise<Note>;
  update(
    noteId: string,
    note: Partial<Omit<Note, 'noteId' | 'createdAt'>>,
  ): Promise<Note>;
  delete(noteId: string): Promise<void>;
}

export function NotesService(notesRepository: INotesRepository): INotesService {
  return {
    async byId(noteId: string) {
      return tracer.trace('notes-service-by-id', () => {
        try {
          return notesRepository.byId(noteId);
        } catch (error) {
          logger.withFields({ error, noteId }).warn('Error getting note by id');
          return undefined;
        }
      });
    },
    async notesByUserId(userId: string) {
      return tracer.trace('notes-service-notes-by-user-id', () => {
        try {
          return notesRepository.find({ userId });
        } catch (error) {
          logger
            .withFields({ error, userId })
            .warn('Error getting notes by user id');
          return [];
        }
      });
    },
    async all() {
      return tracer.trace('notes-service-all', () => {
        try {
          return notesRepository.find();
        } catch (error) {
          logger.withFields({ error }).warn('Error getting all notes');
          return [];
        }
      });
    },
    async create(note: Omit<Note, 'noteId'>) {
      return tracer.trace('notes-service-create', async () => {
        try {
          const notes = await notesRepository.find();
          return notesRepository.create({
            ...note,
            noteId: `note-${notes.length + 1}`,
            createdAt: Date.now(),
          });
        } catch (error) {
          logger.withFields({ error, note }).error('Error creating note');
          throw error;
        }
      });
    },
    async update(
      noteId: string,
      note: Partial<Omit<Note, 'noteId' | 'createdAt'>>,
    ) {
      return tracer.trace('notes-service-update', () => {
        try {
          return notesRepository.update(noteId, note);
        } catch (error) {
          logger
            .withFields({ error, noteId, note })
            .error('Error updating note');
          throw error;
        }
      });
    },
    async delete(noteId: string) {
      return tracer.trace('notes-service-delete', () => {
        try {
          return notesRepository.delete(noteId);
        } catch (error) {
          logger.withFields({ error, noteId }).error('Error deleting note');
          throw error;
        }
      });
    },
  };
}
