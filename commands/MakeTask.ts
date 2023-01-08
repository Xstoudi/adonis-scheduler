import { join } from 'node:path'
import { BaseCommand, args } from '@adonisjs/core/build/standalone'

export default class MakeJob extends BaseCommand {
  public static commandName = 'make:task'
  public static description = 'Make a new task'

  @args.string({ description: 'Name of the job class' })
  public name!: string

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    const stub = join(__dirname, '..', '..', '/templates/make_task.txt')
    const path = this.application.resolveNamespaceDirectory('tasks')

    this.generator
      .addFile(this.name, { pattern: 'pascalcase', form: 'singular' })
      .stub(stub)
      .destinationDir(path || 'app/Tasks')
      .useMustache()
      .appRoot(this.application.cliCwd || this.application.appRoot)
      .apply({ name: this.name })

    await this.generator.run()
  }
}
