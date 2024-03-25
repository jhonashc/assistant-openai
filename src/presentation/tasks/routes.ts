import { Router } from "express";

import { TasksController } from "./controller";
import { TasksService } from "../services/tasks.service";

export class TasksRoutes {
  static get routes() {
    const router = Router();

    const tasksService = new TasksService();
    const tasksController = new TasksController(tasksService);

    router.post("/", tasksController.createTask);
    router.get("/pending", tasksController.pendingTask);

    return router;
  }
}
