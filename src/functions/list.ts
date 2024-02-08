import { NotesService } from '@core/services/notes.js';
import { NotesRepository } from '@core/repositories/notes.js';

const notesRepository = NotesRepository();
const notesService = NotesService(notesRepository);

export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify(await notesService.all()),
  };
}
