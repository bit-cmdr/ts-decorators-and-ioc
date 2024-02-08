import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { INotesService } from '@core/services/notes.js';
import { container } from '@core/bootstrap.js';

const notesService = container.get<INotesService>('INotesService');

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
