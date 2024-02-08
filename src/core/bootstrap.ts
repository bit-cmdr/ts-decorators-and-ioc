import 'reflect-metadata';
import { Container } from 'inversify';
import { NotesRepository, INotesRepository } from '@core/repositories/notes.js';
import { NotesService, INotesService } from '@core/services/notes.js';

const container = new Container();

container.bind<INotesRepository>('INotesRepository').to(NotesRepository);
container.bind<INotesService>('INotesService').to(NotesService);

export { container };
