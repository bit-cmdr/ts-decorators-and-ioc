import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { NotesService } from '@core/services/notes.js';
import { NotesRepository } from '@core/repositories/notes.js';

const notesRepository = new NotesRepository();
const notesService = new NotesService(notesRepository);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.pathParameters?.id || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true }),
    };
  }

  const note = await notesService.byId(event.pathParameters.id);

  if (!note) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: true }),
    };
  }

  const data = JSON.parse(event.body);

  note.content = data.content;

  return {
    statusCode: 200,
    body: JSON.stringify(note),
  };
};
