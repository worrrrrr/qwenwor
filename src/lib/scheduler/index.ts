// Automation Scheduler System
import type { ScheduledTask } from '$lib/types';

class Scheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private intervals: Map<string, ReturnType<typeof setInterval>> = new Map();

  scheduleTask(task: Omit<ScheduledTask, 'id' | 'lastRun' | 'nextRun'>): ScheduledTask {
    const id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const scheduledTask: ScheduledTask = {
      ...task,
      id,
      lastRun: undefined,
      nextRun: this.calculateNextRun(task.cronExpression)
    };

    this.tasks.set(id, scheduledTask);
    
    if (task.enabled) {
      this.startTask(scheduledTask);
    }

    return scheduledTask;
  }

  private calculateNextRun(cronExpression: string): Date {
    const now = new Date();
    return new Date(now.getTime() + 60000);
  }

  private startTask(task: ScheduledTask): void {
    if (this.intervals.has(task.id)) {
      this.stopTask(task.id);
    }

    const interval = setInterval(() => {
      if (task.enabled) {
        this.executeTask(task);
        task.lastRun = new Date();
        task.nextRun = this.calculateNextRun(task.cronExpression);
      }
    }, 60000);

    this.intervals.set(task.id, interval);
  }

  private async executeTask(task: ScheduledTask): Promise<void> {
    console.log(`Executing scheduled task: ${task.name} (${task.id})`);
  }

  stopTask(taskId: string): boolean {
    const interval = this.intervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskId);
      return true;
    }
    return false;
  }

  enableTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    
    task.enabled = true;
    this.startTask(task);
    return true;
  }

  disableTask(taskId: string): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    
    task.enabled = false;
    this.stopTask(taskId);
    return true;
  }

  getTask(taskId: string): ScheduledTask | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  getEnabledTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values()).filter(t => t.enabled);
  }

  deleteTask(taskId: string): boolean {
    this.stopTask(taskId);
    return this.tasks.delete(taskId);
  }

  updateTask(taskId: string, updates: Partial<ScheduledTask>): boolean {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    const wasEnabled = task.enabled;
    Object.assign(task, updates);

    if (task.enabled && !wasEnabled) {
      this.startTask(task);
    } else if (!task.enabled && wasEnabled) {
      this.stopTask(taskId);
    }

    return true;
  }
}

export const scheduler = new Scheduler();

export function scheduleTask(name: string, cronExpression: string, action: string, workflowId?: string): ScheduledTask {
  return scheduler.scheduleTask({
    name,
    cronExpression,
    action,
    workflowId,
    enabled: true
  });
}

export function getAllTasks(): ScheduledTask[] {
  return scheduler.getAllTasks();
}

export function getTask(id: string): ScheduledTask | undefined {
  return scheduler.getTask(id);
}

export function enableTask(taskId: string): boolean {
  return scheduler.enableTask(taskId);
}

export function disableTask(taskId: string): boolean {
  return scheduler.disableTask(taskId);
}

export function deleteTask(taskId: string): boolean {
  return scheduler.deleteTask(taskId);
}
