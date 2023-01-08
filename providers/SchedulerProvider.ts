import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { Scheduler } from '../src/Scheduler'

export default class SchedulerProvider {
  constructor(protected app: ApplicationContract) {}

  public async register() {
    this.app.container.withBindings(
      ['Adonis/Core/Logger', 'Adonis/Core/Application'],
      (logger, app) => {
        this.app.container.singleton('StouderIO/Scheduler', () => {
          return new Scheduler(logger, app)
        })
      }
    )
  }

  public async boot() {
    const scheduler = this.app.container.use('StouderIO/Scheduler')
    await scheduler.loadTasks()
  }

  public async ready() {
    const scheduler = this.app.container.use('StouderIO/Scheduler')
    if (this.app.environment === 'console') {
      return
    }

    if (scheduler.tasks.size === 0) {
      this.app.logger.info("no tasks found, scheduler didn't start")
      return
    }

    await scheduler.start()
    this.app.logger.info(
      `started scheduler, ${scheduler.tasks.size} task${scheduler.tasks.size > 0 ? 's' : ''}`
    )
  }
}
