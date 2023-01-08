<div align="center">
  <h3>adonis-scheduler</h3>
  <p>Unopinionated scheduler for Adonis</p>
  <a href="https://www.npmjs.com/package/@stouder-io/adonis-scheduler">
    <img src="https://img.shields.io/npm/v/@stouder-io/adonis-scheduler.svg?style=for-the-badge&logo=npm" />
  </a>
  <img src="https://img.shields.io/npm/l/@stouder-io/adonis-scheduler?color=blueviolet&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript" />
</div>

## Installation
```
npm i @stouder-io/adonis-scheduler
node ace configure @stouder-io/adonis-scheduler
```

# Usage
Simply run the following command to create a new task:
```
node ace make:task MyFirstTask
```

This will create the following file under `app/Tasks` directory:
```ts
import { TaskContract } from '@ioc:StouderIO/Scheduler'

export default class MyFirstTask implements TaskContract {
  public readonly name: string = '{{ name }}'
  public readonly cron: string = '* * * * *'

  public async run(): Promise<void> {
    
  }
}
```

Simply edit the cron expression to configure the task execution recurrence and code what it should do in the `run` function.
