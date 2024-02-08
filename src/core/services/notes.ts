import { apm } from '../tracer.js';
import { injectable, inject } from 'inversify';
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

@injectable()
export class NotesService implements INotesService {
  private readonly _notesRepository: INotesRepository;
  constructor(
    @inject('INotesRepository') notesRepository: INotesRepository,
    ) {
    this._notesRepository = notesRepository;
  }

  @apm('NotesService')
  async byId(noteId: string) {
    try {
      return this._notesRepository.byId(noteId);
    } catch (error) {
      logger.withFields({ error, noteId }).warn('Error getting note by id');
      return undefined;
    }
  }

  @apm('NotesService')
  async notesByUserId(userId: string) {
    try {
      return this._notesRepository.find({ userId });
    } catch (error) {
      logger
        .withFields({ error, userId })
        .warn('Error getting notes by user id');
      return [];
    }
  }

  @apm('NotesService')
  async all() {
    try {
      return this._notesRepository.find();
    } catch (error) {
      logger.withFields({ error }).warn('Error getting all notes');
      return [];
    }
  }

  @apm('NotesService')
  async create(note: Omit<Note, 'noteId'>) {
    try {
      const notes = await this._notesRepository.find();
      return this._notesRepository.create({
        ...note,
        noteId: `note-${notes.length + 1}`,
        createdAt: Date.now(),
      });
    } catch (error) {
      logger.withFields({ error, note }).error('Error creating note');
      throw error;
    }
  }

  @apm('NotesService')
  async update(
    noteId: string,
    note: Partial<Omit<Note, 'noteId' | 'createdAt'>>,
  ) {
    try {
      return this._notesRepository.update(noteId, note);
    } catch (error) {
      logger.withFields({ error, noteId, note }).error('Error updating note');
      throw error;
    }
  }

  @apm('NotesService')
  async delete(noteId: string) {
    try {
      return this._notesRepository.delete(noteId);
    } catch (error) {
      logger.withFields({ error, noteId }).error('Error deleting note');
      throw error;
    }
  }
}