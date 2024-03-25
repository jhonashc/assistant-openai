import { Router } from 'express';

import { TasksRoutes } from './tasks/routes';
import { AssistantRoutes } from './assistant/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use('/api/tasks', TasksRoutes.routes);
    router.use('/api/assistants', AssistantRoutes.routes);

    return router;
  }
}
