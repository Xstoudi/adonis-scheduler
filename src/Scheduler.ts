import type { LoggerContract } from '@ioc:Adonis/Core/Logger'
import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { CachedTask, SchedulerContract } from '@ioc:StouderIO/Scheduler'

import { parseExpression } from 'cron-parser'

import { sourceFiles } from './utils/sourceFiles'

export class Scheduler implements SchedulerContract {
  private tasks: Map<string, CachedTask> = new Map()

  constructor(private logger: LoggerContract, private app: ApplicationContract) {}

  public async loadTasks() {
    const files = await sourceFiles(
      this.app.appRoot,
      this.app.resolveNamespaceDirectory('tasks') || './app/Tasks'
    )

    for (const file of files) {
      const task = new (file.getTask())()
      if (this.tasks.has(task.name)) {
        this.logger.error(`task ${task.name} already exists`)
        continue
      }

      const cronExpression = parseExpression(task.cron)
      this.tasks.set(task.name, {
        cron: cronExpression,
        nextRunAt: cronExpression.next(),
        task,
      })
    }
  }

  private nextTask(): [string, CachedTask] | null {
    let foundEntry: [string, CachedTask] | null = null
    for (const [name, cachedTask] of this.tasks) {
      if (
        foundEntry === null ||
        cachedTask.nextRunAt.getTime() < foundEntry[1].nextRunAt.getTime()
      ) {
        foundEntry = [name, cachedTask]
      }
    }

    if (foundEntry === null) {
      this.logger.warn('no next task found, scheduler stopped.')
      return null
    }

    return foundEntry
  }

  public async wakeUp() {
    // run every old tasks
    const tasksToUpdate: string[] = []
    for (const [name, cachedTask] of this.tasks) {
      if (cachedTask.nextRunAt.getTime() <= Date.now()) {
        try {
          await cachedTask.task.run()
        } catch (error) {
          this.logger.error(`task ${name} failed: ${error.message}`)
        }
        tasksToUpdate.push(name)
      }
    }

    for (const taskToUpdate of tasksToUpdate) {
      const cachedTask = this.tasks.get(taskToUpdate)
      if (cachedTask === undefined) {
        this.logger.error(`task ${taskToUpdate} not found`)
        continue
      }
      cachedTask.nextRunAt = cachedTask.cron.next()
    }

    // pick next task
    const nextTask = this.nextTask()
    if (nextTask === null) {
      return
    }

    // set timeout
    setTimeout(() => {
      this.wakeUp()
    }, nextTask[1].nextRunAt.getTime() - Date.now())
  }

  public async start() {
    const nextTask = this.nextTask()
    if (nextTask === null) {
      return
    }

    setTimeout(() => {
      this.wakeUp()
    }, nextTask[1].nextRunAt.getTime() - Date.now())
  }
}
