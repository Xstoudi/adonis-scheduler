import { fsReadAll, resolveDir } from '@poppinss/utils/build/helpers'
import { extname, join } from 'path'
import slash from 'slash'
import { esmRequire } from '@poppinss/utils'
import { TaskContract, TaskFile } from '@ioc:StouderIO/Scheduler'

export function sourceFiles(
  fromLocation: string,
  directory: string
): Promise<TaskFile<TaskContract>[]> {
  return new Promise((resolve) => {
    try {
      const absDirectoryPath = resolveDir(fromLocation, directory)
      let files = fsReadAll(absDirectoryPath)
      resolve(
        files.map((file: string) => {
          const name = join(directory, file.replace(RegExp(`${extname(file)}$`), ''))

          return {
            absPath: join(absDirectoryPath, file),
            name: slash(name),
            getTask() {
              return esmRequire(this.absPath)
            },
          }
        })
      )
    } catch (error) {
      console.log(error)
      resolve([])
    }
  })
}
