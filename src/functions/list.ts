import { INotesService } from '@core/services/notes.js';
import { container } from '@core/bootstrap.js';

const notesService = container.get<INotesService>('INotesService');

export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify(await notesService.all()),
  };
}
