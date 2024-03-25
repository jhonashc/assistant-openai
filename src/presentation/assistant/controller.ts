import e, { Request, Response } from 'express';

import { AssistantService } from '../services/assistant.service';

export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  createThread = (req: Request, res: Response) => {
    this.assistantService
      .createThread()
      .then((thread) => res.status(201).json(thread))
      .catch((error) => res.status(400).json({ error }));
  };

  userQuestion = (req: Request, res: Response) => {
    this.assistantService
      .useQuestion(req.body)
      .then((messages) => res.status(201).json(messages))
      .catch((error) => {
        console.error(error);
        return res.status(400).json({ error });
      });
  };
}
