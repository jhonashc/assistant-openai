import { Request, Response } from "express";

import { TasksService } from "../services/tasks.service";
import { Task } from "../../domain/interfaces/task.interface";

export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  createTask = (req: Request, res: Response) => {
    const { title, description, status } = req.body;

    const newTask: Task = {
      title,
      description,
      status,
    };

    this.tasksService
      .createTask(newTask)
      .then((task) => res.status(201).json(task))
      .catch((error) => res.status(500).json({ error }));
  };

  pendingTask = (req: Request, res: Response) => {
    res.json(this.tasksService.pendingTask);
  };
}
