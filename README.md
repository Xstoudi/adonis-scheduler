<div align="center">
  <img src="https://user-images.githubusercontent.com/2575182/236929207-c76d0ae4-5a6f-4951-b452-db1440edb0e7.png" />
  <h3>@stouder-io/adonis-scheduler</h3>
  <p>Unopinionated scheduler for Adonis</p>
  <a href="https://www.npmjs.com/package/@stouder-io/adonis-scheduler">
    <img src="https://img.shields.io/npm/v/@stouder-io/adonis-scheduler.svg?style=for-the-badge&logo=npm" />
  </a>
  <img src="https://img.shields.io/npm/l/@stouder-io/adonis-scheduler?color=blueviolet&style=for-the-badge" />
  <img alt="npm" src="https://img.shields.io/npm/dt/@stouder-io/adonis-scheduler?style=for-the-badge">
</div>

## Installation
This package is available in the npm registry.
```
npm i @stouder-io/adonis-scheduler
```

Next, configure the package by running the following command.
```
node ace configure @stouder-io/adonis-scheduler
```

## Usage
The scheduler will start with your Adonis server, but no task is loaded.

To create a task, run the following command.
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

The `run` method is called when the scheduler run the task according to the cron expression you configure in the `cron` field. `name` is just for internal use, but it must be unique.

Please note that running CPU-intensive operations in the task has the potential to block your full web application as Node.js is single-threaded.

If you need to run high-intensive CPU task, you could run an Ace command using `execa`, for example:
```ts
import { TaskContract } from '@ioc:StouderIO/Scheduler'
import execa from 'execa'

export default class MyFirstTask implements TaskContract {
  public readonly name: string = 'test-task'
  public readonly cron: string = '* * * * *'

  public async run(): Promise<void> {
    // will execute `node ace intensive` every minute
    execa.node('ace', ['intensive'], { stdio: 'inherit' })
  }
}
```

Also, if you run multiple instances of your Adonis application, the tasks will be ran on each instance.
