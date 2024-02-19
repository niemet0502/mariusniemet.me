---
title: Building your first Rest API with Nestjs and TypeORM and test it with Postman
date: "2023-03-25"
description: "A REST API is a web API that uses HTTP requests to allow clients to access and manipulate resources, identified by URIs, using standard HTTP methods. It’s designed to be stateless and is commonly used to expose data and functionality from a server-side application to client-side applications or third-party developers."
published: true
author: "marius niemet"
slug: building-your-first-restapi-with-nestjs-and-typeorm
categorie: backend
---

### REST API

A REST API is a web API that uses HTTP requests to allow clients to access and manipulate resources, identified by URIs, using standard HTTP methods. It’s designed to be stateless and is commonly used to expose data and functionality from a server-side application to client-side applications or third-party developers.

### NestJS

NestJS is a Node.js framework for building scalable and efficient server-side applications, with built-in features and modules for dependency injection, middleware, routing, and more, as well as support for multiple databases and testing tools.

### TypeORM

TypeORM is an Object-Relational Mapping (ORM) library for TypeScript and JavaScript that provides a simplified interface for working with relational databases using object-oriented programming techniques. It allows developers to define database schemas using TypeScript classes and decorators, supports multiple databases, and provides features such as database migrations.

### Let’s get started

Firstly you have to install the Nestjs CLI globally

```
npm i -g @nestjs/cli
```

and then create a new project

```
nest new rest-api
```

Before creating the project, nestjs will ask which package manager you use I choose npm but you have the choice between npm, yarn, or pnpm.

So let’s see what Nestjs has generated for us.

- **node_modules:** a folder for our dependencies
- **test:** is where nestjs suggest you put your end-to-end tests.
- **boilerplate files:** for package management, typescript configuration, and static code checking.
- **src:** a folder that contains several core files it’s where we will write our code.

Once the installation is complete you can run the following command to run your app

```
npm run start
```

This command will run your app on the port indicated in the main.ts file. You can also run

```
npm run start:dev
```

This command will run your app and reload every time you edit a file.

Now our app is created, we know how to run it, let’s build. We want an app that handles users and basic crud operations. Those users should be stored in a database.

### Database set up

We are going to use TypeORM and MySQL for storage. Nestjs provides tight integration with TypeORM out-of-the-box with the `@nestjs/typeorm` package. We just have to install the packages.

```
npm install --save @nestjs/typeorm typeorm mysql2
```

and then connect the database by using the `TypeOrmModule` provide by `@nestjs/typeorma` longside the different database params (host, user name, user password, database name):

```javascript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "",
      database: "restapi",
      entities: ["src/**/**.entity{.ts,.js}"],
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Now our database is connected to the project.

### Resource handling

Nestjs manage resources, a resource is a folder or module that represents a part of your app’s domain. For each resource of your app, you have a controller, service, dto, and entity. In our case we want to manage users, so users are our resource.

To create a new resource we tap the command below by adding the name of the resource we are creating.

```
nest g resource users
```

The cli will ask you two questions:

- What transport layer do you use?: choose REST API
- Would you like to generate CRUD entry points?: Yes

And then the following folder and files will be created.

### Entity

Now we have all the boilerplate set up, we need to define the user entity, to do that we will edit the user.entity.ts file and use the decorator provide by typeOrm.

```javascript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  firstname: string;

  @Column("text")
  lastname: string;

  @Column("text")
  email: string;
}
```

First, we need to add the `@Entity` decorator before the class definition to tell typeOrm that the next class will be an entity and then for the attributes you have two decorators, `@PrimaryGeneratedColumn` to create a primary and auto-increment key, and @Column to create other table columns. To define column type, we have just to define it in the `@Column` decorator, in our case the three attributes are text, but you can use number, boolean, and so on.

### DTO

When the user's resources have been generated for us, there had a folder called dto with two files `create-user.dto.ts` and `update-user.dto.ts`.

Dto is a class that shapes the data we want to receive while creating a new entry for our database. The `create-user.dto.ts` will contain the attribute we want to receive to create a new user and if those attributes aren’t available the request won’t reach the service layer. In this case, we have only three attributes we want to receive so let’s update the `create-user.dto.ts`

```javascript
export class CreateUserDto {
  public firstname: string;
  public lastname: string;
  public email: string;
}
```

### Service

The service layer is the layer in which we implement our business logic, its also this layer that communicates with the layer that interacts with the database mostly called the Repository layer and the controller layer.

Typically, the service layer receives the data that has been sent by the user from the controller, the service layer applies the business logic on those data and then calls the repository layer to store it in the database.

When you generate a new resource through the cli, you have a service that is created with few methods.

```javascript
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
```

We will edit this class. In the introduction above we say that the service layer needs to call the repository layer to interact with the database.

Since we are using TypeOrm, it provides a built-in class that comes with the method to handle the data related to a given entity.

Nestjs favor dependency injection to allow two different class to interact, dependency injection is an [inversion of control (IoC)](https://en.wikipedia.org/wiki/Inversion_of_control) technique wherein you delegate the instantiation of dependencies to the IoC container, instead of doing it in your own code imperatively. Let’s edit the user service.

```javascript
 constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
```

To inject the repository we have to do that in the constructor, by using the InjectRepository decorator, and declaring a private variable that has the type Repository provide by typeOrm with the entity we want to manage.

But every time we use an external dependency we need to import it, so that will be available in the service we wanted to use it. To import an external dependency we have to edit the [module](https://docs.nestjs.com/modules) of the resource we are working with.

```javascript
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm/dist";
import { User } from "./entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

Once it’s done the userRepository variable will be available in every function of that class.

Now the repository is set up, we can use it to read, create, update, and delete the users.

```javascript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const toUpdate = await this.userRepository.findOne({ where: { id } });

    const updated = Object.assign(toUpdate, updateUserDto);

    return await this.userRepository.save(updated);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
```

We have converted all methods to async methods since the repository’s methods return Promises and we have to handle those promises.

Now we have set up the service, inject the repository and each method within the service communicates with the repository to store the data it receives, we can move to the next layer.

### Controller

The controller layer is the layer in which we handle the user request and send data to the service layer. Each method in the controller will be converted to an endpoint with which the final user will interact.

We have used the cli to generate the user's resource, so we already have a controller ready to be used without any changes. Let’s see how it looks:

```javascript
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

Since the controller has to interact with the service layer, we follow the same method as in the service layer, we inject the service class by using the dependency injection.

Each decorator before each method defines the method that will be used to call the endpoint.

The Body decorator in the update and create method are used to validate the request body. You can provide a type, here we provide the DTO class that we have created in the first part of the article to be sure that the data we receive is shaped as we want.

The decorator Param is used to getting the request’s params by defining the name of the param with its type.

Since the endpoint method is defined, and the request params and body are validated, we call the service method that will apply our business logic on it and then call the repository to interact with the database.

### Testing the API

We will use [postman](https://www.postman.com/) to test our API.

Postman is a tool for building, testing and documenting APIs. It simplifies the process of making HTTP requests and inspecting responses, allows for easy collaboration among team members, and supports automated testing and integration with CI/CD pipelines.

### Conclusion

In conclusion, building a REST API with NestJS, TypeORM, and MySQL can be a powerful combination for creating robust and scalable web applications. With NestJS, you can take advantage of its modular architecture and dependency injection to build highly testable and maintainable code. TypeORM simplifies the process of working with databases by providing a rich set of tools and features for handling data access and manipulation. Postman provides a user-friendly interface to test your Rest API.

You can find the final code for this project [here](https://github.com/Marius-s-Aricles/nestjs-rest-api).

I hope this article has been helpful in guiding you through the process of building a REST API with these technologies.
