declare module '@ioc:StouderIO/Scheduler' {
  import type { CronExpression, CronDate } from 'cron-parser'

  export interface TaskContract {
    readonly name: string
    readonly cron: string

    run(): Promise<void>
  }

  export interface SchedulerContract {
    loadTasks(): Promise<void>
    wakeUp(taskName: string): Promise<void>
    start(): Promise<void>
  }

  export interface CachedTask {
    cron: CronExpression
    nextRunAt: CronDate
    task: TaskContract
  }

  export interface TaskFile<T extends TaskContract> {
    absPath: string
    name: string
    getTask(): { new (): T }
  }

  const Scheduler: SchedulerContract
  export default Scheduler
}
