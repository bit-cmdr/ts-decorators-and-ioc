import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { NotesService } from '@core/services/notes.js';
import { NotesRepository } from '@core/repositories/notes.js';

const notesRepository = new NotesRepository();
const notesService = new NotesService(notesRepository);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.pathParameters?.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: true }),
    };
  }

  const note = await notesService.byId(event.pathParameters.id);
  return note
    ? {
        statusCode: 200,
        body: JSON.stringify(note),
      }
    : {
        statusCode: 404,
        body: JSON.stringify({ error: true }),
      };
};
