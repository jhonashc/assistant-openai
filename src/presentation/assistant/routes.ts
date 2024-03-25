import { Router } from 'express';

import { AssistantController } from './controller';
import { AssistantService } from '../services/assistant.service';
import { OpenAIService } from '../services/openai.service';

export class AssistantRoutes {
  static get routes() {
    const router = Router();

    const assistantService = new AssistantService(new OpenAIService());
    const assistantController = new AssistantController(assistantService);

    router.post('/create-thread', assistantController.createThread);
    router.post('/user-question', assistantController.userQuestion);

    return router;
  }
}
