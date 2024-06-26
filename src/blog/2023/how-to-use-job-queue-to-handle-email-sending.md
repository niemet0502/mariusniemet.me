---
title: How to use Job Queue to handle email sending in your Nestjs server
date: "2023-06-26"
description: "In this article, we will see how you can send email from your Nestjs app, and to do that we will also use a mechanism called Job Queue."
published: true
author: "marius niemet"
slug: how-to-use-job-queue-to-handle-email-sending
categorie: backend
---

In this modern era, when a user uses your software they expect to be notified every time an action is made, sometimes by him or other users, there are many ways to inform a user, such as by sending a push notification, email, or SMS. Nevertheless, email sending is one of the most frequently used by software in addition to others, very often an email is sent when a new user signs up, resets his password, and so on.

In this article, we will see how you can send email from your Nestjs app, and to do that we will also use a mechanism called **Job Queue**.

### What is a job Queue and why is it useful?

A Queue is a data structure that is used to execute some tasks in an organized and efficient manner, it follows a principle named FIFO (First in First Out) Which means the first task added to the queue will always be the first to be executed. And on the other hand job queue is a mechanism inspired by the queue data structure that is used to deal with common application scaling and performance challenges.

It’s commonly used for background processing, in applications where time or resource-consuming tasks need to be performed asynchronously, a job queue can be used to offload the work to a separate process or thread. This allows the main application to remain responsive while the tasks are executed in the background. It can be the case for email sending, imagine having thousands of users that register at the same time, and you need to send a welcome email to every one of them, this kind of scenario can slow down your application if email sending is handled by the main process instead you can use a Job queue that will store every email sending task and process them in a different thread than the main.

// image

Overall, we want to build something like the illustration above. The client represents our NestJs application that will add jobs to the queue and then we will have some process that will get jobs from the storage and then execute them.

### Requirements

To build our project we need the following requirements:

- SMTP server to send our emails
- Nodejs package that handles job queue
- Nodejs package that handles email sending

### SMTP server

For this article, we will use the SMTP server provided by SendGrid which is commonly used, but you can also use a different SMTP server such as [AWS SES](https://aws.amazon.com/ses/) or even the Gmail SMTP server. The only thing you will change here is your secrets.

So for the next step, I will assume you already have an email-sending provider ready and your secrets.

### Job Queue Handling

As you may have already guessed, we are going to use Nestjs during this article, and the thing that I like about NestJs is it provides packages to handle some of the common concepts such as ORM, Job queue, Cron job, and so on that wrapped popular package, it helps to integrate those features on a Nest-friendly way to your application.

For Job Queue, NestJs provides a package named `@nestjs/bull` as an abstraction/wrapper on top of [Bull](https://github.com/OptimalBits/bull), a popular, well-supported, high-performance Node. js-based Queue system implementation.

Bull uses [Redis](https://redis.io/) to persist job data, so you’ll need Redis installed on your system.

While working with Jobs queue, two concepts are essential to understand, it’s **producers**, **storage**, and **workers or processors**.

- **Producers**: their role is to add jobs to the queue. While adding a job to the queue, you have to add the data needed to effectively execute the job as well.
- **Workers or Processors**: their role is to process jobs added to the queue. they run on separate processes from the main application process.
- **Queue storage**: a storage in which the jobs are stored, bull uses Redis as its queue storage.

Now let’s write some code

Create a new NestJS project:

```
nest new job-queue-example
```

Package installation:

```
npm install --save @nestjs/bull bull
```

Once the installation process is complete, we can import the `BullModule` into the root `AppModule`.

```javascript
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

The `forRoot()` method is used to register a `bull` package configuration object that will be used by all queues registered in the application. As we have mentioned above bull needs a Redis instance to store the queue which is why we need to provide Redis connection information.

Once the package is configured, the next step is to register the queue. It’s possible to have multiple queues for one project, every queue will handle different types of jobs like email sending which is our use case here, but your app can need to handle other tasks like notifications and Push messages, file processing, and so on.

For queue registering we use `BullModule.regirsterQueue()` it should be added to the module in which the job will be added to the queue. Since we want to keep this tutorial as short as possible, we won’t create another module, we will only use the app module, so let’s edit the `App.module` file once again:

```javascript
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: "emailSending",
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Each queue is unique by its name property. A queue name is used for both adding and processing jobs, we will see that in the next part.

After this step, we have our queue package configured, and we have created a dedicated queue for email sending, now it’s time to create `producer` and `processor`.

### Producer

As mentioned above, producers add jobs to the queue, and in nestjs, they are typically application services (a class that has the `@Injectable` decorator).

To add jobs to a queue, first, inject the queue into the service as follows:

```javascript
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}
}
```

The queue is recognized by its name, it should be the name used to register the queue.

Create an interface to type the job data:

```javascript
export interface Mail {
  from: string;
  to: string;
  subject: string;
  text: string;
  [key: string]: any;
}
```

Once the queue is injected into the application service, we can create a method that will add a job.

```javascript
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Mail } from './mail.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}

  async sendEmail(data: Mail) {
    const job = await this.emailQueue.add({ data });

    return { jobId: job.id };
  }
}
```

We have created a `sendEmail` method that uses the `emailQueue` to add a job. The parameters it receives are the data needed by the processor to send the email, it can be the user email address, the email content, and different information.

**Named Jobs**: jobs may have a name, which allows us to create specifics jobs, imagine our application has to send different types of email for example we can send a welcome email (when a new user is registered) or a reset password email (when a user want to reset his password) we don’t want these jobs to be handled by the same consumer.

```javascript
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Mail } from './mail.interface';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}

  async sendWelcomeEmail(data: Mail) {
    const job = await this.emailQueue.add('welcome', { data });

    return { jobId: job.id };
  }

  async sendResetPasswordEmail(data: Mail) {
    const job = await this.emailQueue.add('reset-password', { data });

    return { jobId: job.id };
  }
}
```

### Processor or consumer or worker

As mentioned above, processors process jobs from the queue, in Nestjs they are classes that have the `@Processor` decorator provided by `@nestjs/bull`. The decorator receives the name of the queue it has to consume.

Let’s create a file named `EmailProcessor` and then inside create a class with the same name and prefix by the decorator.

```javascript
import { Processor } from "@nestjs/bull";

@Processor("emailSending")
export class EmailProcessor {}
```

Now we have our Processor class, let’s create the method (process) that will handle every job.

```javascript
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor("emailSending")
export class EmailProcessor {
  @Process("welcome")
  async sendWelcomeEmail(job: Job<Mail>) {
    const { data } = job;

    // send the welcome email here
  }

  @Process("reset-password")
  async sendResetPasswordEmail(job: Job<Mail>) {
    const { data } = job;

    // send the reset password email here
  }
}
```

The `@Process` is a decorator provided by `@Nestjs/bull` it helps us to create specific processors, in the previous section we have created different types of jobs according to the type of email we want to send, we have to do the same for processes as well.

The `reset-password` processor will be called every time a job of the type `reset-password` will be added to the queue same for the `welcome` process.

That’s all for the Job queue setting.

### Email sending

You may notice that in the previous part, we didn’t write the logic to send emails, we have only added a comment for where the logic will be written, it’s because the emails sending will be handled by another package that we need to set up as well.

We will use a package named `@nestjs-modules/mailer` it’s a package for NestJS that provides email-sending capabilities, built on top of the popular library [Nodemailer](https://nodemailer.com/about/).

Dependencies installation:

```
npm i @nestjs-modules/mailer nodemailer
```

Update the `app.module` to configure the Mailer Module:

```javascript
import { MailerModule } from "@nestjs-modules/mailer";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: "emailSending",
    }),
    MailerModule.forRoot({
      transport: {
        host: "smtp.example.com",
        port: 587,
        auth: {
          user: "username",
          pass: "password",
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

From lines 18 to 27, we have added a new object which is `MailerModule` to make sure it works you have to update the code above with your SMTP server credentials.

Once the package is set up, it will provide a `MailService` class that has a method named `sendEmail` that will receive some parameters and then send the mail. But first, we need to create the mail template and for that, we will use [handlebars](https://handlebarsjs.com/). It will allow us, to create HTML templates in which we can pass dynamics parameters, such as the user name or its information, and write inline CSS to style our email.

Handlebars installation:

```
npm i handlebars
```

Then we need to create a folder inside srcin which our template will be located

// image

Once it’s done we have to update two files the `nestjs-cli.json` and the `app.module` to notify the Mailer Module where it can find the template it needs to use.

```
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "assets": ["templates/**"],
    "deleteOutDir": true
  }
}
```

We have added the 6th line and then let’s update the `app.module`.

```javascript
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: "emailSending",
    }),
    MailerModule.forRoot({
      transport: {
        host: "smtp.example.com",
        port: 587,
        auth: {
          user: "username",
          pass: "password",
        },
      },
      template: {
        dir: join(__dirname, "templates"),
        adapter: new HandlebarsAdapter(),
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Now everything is setup we can update our job queue process to send emails:

```javascript
import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Mail } from './mail.interface';

@Processor('emailSending')
export class EmailProcessor {
  constructor(private readonly mailService: MailerService) {}

  @Process('welcome')
  async sendWelcomeEmail(job: Job<Mail>) {
    const { data } = job;

    await this.mailService.sendMail({
      ...data,
      subject: 'Welcome',
      template: 'welcome',
      context: {
        user: data.user,
      },
    });
  }

  @Process('reset-password')
  async sendResetPasswordEmail(job: Job<Mail>) {
    const { data } = job;

    await this.mailService.sendMail({
      ...data,
      subject: 'Reset password',
      template: 'reset-password',
      context: {
        user: data.user,
      },
    });
  }
}
```

First, we injected the `mailService` provided by our package on the `email.processor` which allows us the use the built-in method `sendEmail`.

That method requires some parameters to send the email and those parameters are declared in our mail interface.

// image

After setting the data, we need to set the template as well. The remaining attribute named context is used if you want to pass some variables to your template for customization or to display specific information.

We have come a long way, the last thing to do here for a testing purpose is to create an endpoint that will trigger an email sending.

```javascript
import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Mail } from './dto/mail.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async sendEmail(@Body() data: Mail) {
    await this.appService.sendWelcomeEmail(data);
  }
}
```

Finally, every time a user will call this endpoint with the data, the controller’s method will call the service by passing it the data needed, and then the service will add the job inside the queue and the last one of our process according to the job type, will get the job and then execute (send the email) it.

You can find the whole code for this article [here](https://github.com/Marius-s-Aricles/nestjs-job-queue-email-sending).

### Conclusion

In conclusion, leveraging a job queue to handle email sending in your NestJS application offers several benefits. By decoupling the email-sending process from the request-response cycle, you can improve the responsiveness and performance of your application. The job queue enables asynchronous processing of email tasks, allowing your application to quickly respond to user requests while the email jobs are handled in the background.

I hope you enjoy this article as much as I enjoyed writing it for you.
