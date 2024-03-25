import { Task } from "../../domain/interfaces/task.interface";
import { WssService } from "./wss.service";

export class TasksService {
  private _tasks: Task[] = [];

  constructor(private readonly wssService = WssService.instance) {}

  async createTask(newTask: Task) {
    this._tasks.push(newTask);

    // Ws
    this.onTaskNumberChanged();

    return newTask;
  }

  public get pendingTask() {
    return this._tasks;
  }

  private onTaskNumberChanged() {
    this.wssService.sendMessage("on-task-count-changed", this._tasks.length);
  }
}
