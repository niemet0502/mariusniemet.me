---
title: Writing Unit Tests for your Nestjs Rest API
date: "2023-04-11"
description: "Software test automation refers to using software tools to automate the execution of tests and compare actual results with expected results, resulting in more efficient and accurate testing processes."
published: true
author: "marius niemet"
slug: writting-unit-test-for-your-nestjs-app
categorie: backend
---

Software test automation refers to using software tools to automate the execution of tests and compare actual results with expected results, resulting in more efficient and accurate testing processes. There are multiple tests, including unit testing, integration testing, and end-to-end (E2E) testing. In this article, we will focus on unit tests.

## Unit testing

Unit testing involves testing individual units or components of the software in isolation from the rest of the system to ensure that it performs as expected and meets its design requirements. They use test cases that include a set of inputs and expected outputs, and they can be run automatically and frequently to ensure that changes to the code do not introduce new defects.

## Requirement

For the next part of this article, we need a functional nestjs project, in a previous article we built a Rest API that handles users, we will use the same project, and you can find it [here](https://github.com/Marius-s-Aricles/nestjs-rest-api).

Once you have the project cloned and open in your favorite code editor, we need to install dependencies by running the following command:

```
npm install
```

In the introduction, we mention that software automation refers to using software tools to automate testing, according to the project language and the type of tests you want to write there is a multitude of packages that can be used.

In our case, we have a javascript app for which we want to write unit tests, we can use [Jest](https://jestjs.io/fr/), [mocha](https://mochajs.org/), [Jasmine](https://jasmine.github.io/), or [Chai](https://www.chaijs.com/).

For this article we are going to use Jest, because is the most popular one also when you create a new nestjs project, Jest is installed by default, so we don’t need to install other dependencies.

## Unit tests writing

Since we used a framework, we can assume that its internal working is well tested and then as a developer we are responsible for testing the code that we have written. For the project that will be ours during this article, we can notice that the code written by the developers is focused on the `users.controller` and the `users.service` so we need to write unit tests for each of them.

### Testing the service layer

When using the nestjs cli to generate a new resource, it generates files like the `users.service.ts` and `users.controller.ts` for each file, it also generated a file with the same name but with .spec.ts as extension, those files are for writing tests. So when you wanted to write a unit test you can edit those files instead of creating a new file on your own.

Let’s check what is the users.service.spec.ts content:

```javascript
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get < UsersService > UsersService;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
```

As you can see, we have a bunch of code that might not be familiar to you, we are going to explain every part of this code before moving forward.

The `describe` annotation is used to group related test cases and provide a description of what the group of tests is intended to test in our case we want to test the `UsersService` class. Then it declares a new variable `service` of type `UsersService` it’s an instance of the class we want to test.

The `BeforeEach` is an annotation that will allow us to run a bunch of operations, before each test, it’s useful if you have data that are mandatory for every test instead of rewriting the same code in every test case you can write that logic in a `BeforeEach`. The code above creates a `TestingModule`.

The Testing Module is provided by `@nestjs/testing` it’s similar to the users.module.ts that we have in the project. Its goal is to provide every dependency that we need to create an instance of UserService.

To create a new Testing Module, we use the `Test.createTestingModule` which is also provided by `@nestjs/testing` that takes as parameters the dependencies, providers, controllers, and so on.

Once the Testing module is created we retrieve an instance of the `UsersService` class from the module and then we assign that to the variable declared above.

Here there is an important thing we need you to pay attention to, when you create a testing module, you need to provide, the class for which you are writing the tests and all dependencies that are injected in that class. The default createTestingModule receives only one parameter `UsersService` itself but the `userRepository` is missing, which means Nest can’t resolve the dependencies to create a new instance, to verify it, you can run the command `npm run test` you will receive the error below

// image

As you can see Nest can’t resolve dependencies, that means before moving forward we need to provide all dependencies that are needed to create an `UserService` instance.

The `it` annotation (also called a test case) is used to define an individual test case.

Now we have reviewed the test file’s default content, we need to edit that according to our needs.

Let me show you the `users.service.ts` code for which we will write tests.

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

As you can see, we have a dependency injected by using dependency injection and a bunch of methods, so writing unit test for this class, means we need to write tests for each method.

I have a few steps that I follow before writing tests, I suggest you to do the same:

First I check if the class for which I'm writing tests interacts with external dependencies, it’s simple to know that, you have just to check if there is dependency injection in the constructor, in this case, we have `@InjectRepository(User) private userRepository: Repository<User>` that means we need to mock that dependency before moving forward.

Second, I create a test case for every method inside the class, to insure I don’t forget to test something.

**Mocking external dependencies:** mocking is a technique used in software testing to create fake or substitute objects that mimic the behavior of real objects or dependencies. This is done to isolate the code being tested from its dependencies so that it can be tested in isolation and with greater control.

For the `users.service` class, we have to mock the `userRepository` class with its method.

```javascript
const mockUserRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};
```

We have created an object named `mockUserRepository` that has attributes named in the same way as the method we want to mock. Every method receives `jest.fn()` that creates a new, empty mock function to mimic the behavior of a real function.

Once the mock object is created we need also to update the Testing module creation.

```javascript
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UsersService,
      {
        provide: getRepositoryToken(User),
        useValue: mockUserRepository,
      },
    ],
  }).compile();

  service = module.get < UsersService > UsersService;
});
```

Since we have mocked all external dependencies and provided them if you run again the command npm run test the test will pass.

// image

Creating test cases for each method: usually, I create test cases for each method.

```javascript
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  let service: UsersService;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get < UsersService > UsersService;
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("create", () => {});

  it("findAll", () => {});
  it("findOne", () => {});
  it("update", () => {});
  it("remove", () => {});
});
```

If you have followed every step with me, your test file should look like this. We have all dependencies set, and all test cases created, then we can finally write the test code.

While writing tests, I always follow the Arrange-Act-Assert pattern, it’s a pattern that helps to make your tests maintainable and understandable.

Let’s see what it looks like:

```javascript

 it('create => Should create a new user and return its data', async () => {
    // arrange
    const createUserDto = {
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    } as CreateUserDto;

    const user = {
      id: Date.now(),
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    } as User;

    jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);

    // act
    const result = await service.create(createUserDto);

    // assert
    expect(mockUserRepository.save).toBeCalled();
    expect(mockUserRepository.save).toBeCalledWith(createUserDto);

    expect(result).toEqual(user);
  });
```

The **Arrange-Act-Assert** pattern suggests you to break your test into three parts:

- **Arrange:** In this part, you arrange all data that you will need for your test, for the UsersService.create method, as you can see it receives a parameter of type CreateUserDto so we need to create a variable for it. the create method also returns a user after calling a method of an external dependency, so we need to create the returned data and then we need to mock the result of that external method, remember we want to test that method in isolation which means you can’t refer to an external dependency. To mock the result returned by the external method we use jest.spyOn
- **Act:** in this part, we call the function we are testing by giving it the data created in the arrange part, we also store its result.
- **Assert:** In the last part we can make our assertions, the goal is to check if the result is equal to what we expect and if the function behaves as we want. First, we check if the mocked function has been called, then we check if it has been called with the right data and finally we check if the result is equal to the mocked value.
  Overall, our test for the UsersService.create method, helps us to be sure that the method behaves as expected, we are sure that the create method of the external dependency will always be called, it will be called with the data received as a parameter by the UsersService.create and if everything goes well, we will receive a brand new user with an id.

Now we can do the same for the remaining methods

```javascript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    const createUserDto = {
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    } as CreateUserDto;

    const user = {
      id: Date.now(),
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    } as User;

    jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);

    // act
    const result = await service.create(createUserDto);

    // assert
    expect(mockUserRepository.save).toBeCalled();
    expect(mockUserRepository.save).toBeCalledWith(createUserDto);

    expect(result).toEqual(user);
  });

  it('findAll => should return an array of user', async () => {
    //arrange
    const user = {
      id: Date.now(),
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    };
    const users = [user];
    jest.spyOn(mockUserRepository, 'find').mockReturnValue(users);

    //act
    const result = await service.findAll();

    // assert
    expect(result).toEqual(users);
    expect(mockUserRepository.find).toBeCalled();
  });
  it('findOne => should find a user by a given id and return its data', async () => {
    //arrange
    const id = 1;
    const user = {
      id: 1,
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    };

    jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(user);

    //act
    const result = await service.findOne(id);

    expect(result).toEqual(user);
    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockUserRepository.findOne).toBeCalledWith({ where: { id } });
  });
  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    const id = 1;
    const user = {
      id: 1,
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    };

    jest.spyOn(mockUserRepository, 'delete').mockReturnValue(user);

    //act
    const result = await service.remove(id);

    expect(result).toEqual(user);
    expect(mockUserRepository.delete).toBeCalled();
    expect(mockUserRepository.delete).toBeCalledWith(id);
  });
});
```

Your final code should look like the code above, we have used the same pattern for each method. Now if you run the npm run test commande you will the result below:
// image
Our six tests have passed 🔥

### Testing the controller layer

Testing the controller layer is almost the same as testing a service class, the main difference here is when we try to create a Testing Module, take a look at the default code in the users.controller.spec.ts :

```javascript
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get < UsersController > UsersController;
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
```

As you can see on line 10, we have an attributed name `controllers` that takes an array of controllers, and another attribute named provider that takes an array of providers. Here we need to do the distinction because we are testing a controller and every class that behaves as a controller is always prefixed by the `@Controller `annotation but the remaining stay the same, we have an external dependency here `UsersService` that we need to mock as we already did in the previous part.

```javascript
import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get < UsersController > UsersController;
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
```

We have created a mocked object and provided it as a dependency to create the testing module. Now let’s create test cases for each method.

```javascript

import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create => should create a new user by a given data', async () => {
    // arrange
    const createUserDto = {
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    } as CreateUserDto;

    const user = {
      id: Date.now(),
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    } as User;

    jest.spyOn(mockUsersService, 'create').mockReturnValue(user);

    // act
    const result = await controller.create(createUserDto);

    // assert
    expect(mockUsersService.create).toBeCalled();
    expect(mockUsersService.create).toBeCalledWith(createUserDto);

    expect(result).toEqual(user);
  });

  it('findAll => should return an array of user', async () => {
    //arrange
    const user = {
      id: Date.now(),
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    };
    const users = [user];
    jest.spyOn(mockUsersService, 'findAll').mockReturnValue(users);

    //act
    const result = await controller.findAll();

    // assert
    expect(result).toEqual(users);
    expect(mockUsersService.findAll).toBeCalled();
  });

  it('findOne => should find a user by a given id and return its data', async () => {
    //arrange
    const id = '1';
    const user = {
      id: 1,
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    };

    jest.spyOn(mockUsersService, 'findOne').mockReturnValue(user);

    //act
    const result = await controller.findOne(id);

    expect(result).toEqual(user);
    expect(mockUsersService.findOne).toBeCalled();
    expect(mockUsersService.findOne).toBeCalledWith(+id);
  });

  it('update => should find a user by a given id and update its data', async () => {
    //arrange
    const id = '1';
    const updateUserDto = {
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    } as UpdateUserDto;
    const user = {
      id: 1,
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    };

    jest.spyOn(mockUsersService, 'update').mockReturnValue(user);

    //act
    const result = await controller.update(id, updateUserDto);

    expect(result).toEqual(user);
    expect(mockUsersService.update).toBeCalled();
    expect(mockUsersService.update).toBeCalledWith(+id, updateUserDto);
  });
  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    const id = '1';
    const user = {
      id: 1,
      firstname: 'Chadwick',
      lastname: 'Boseman',
      email: 'chadwickboseman@email.com',
    };

    jest.spyOn(mockUsersService, 'remove').mockReturnValue(user);

    //act
    const result = await controller.remove(id);

    expect(result).toEqual(user);
    expect(mockUsersService.remove).toBeCalled();
    expect(mockUsersService.remove).toBeCalledWith(+id);
  });
});
```

We have created tests for the `UsersController` methods by always mocking external dependency and using the AAA pattern to ensure maintainability and readability.

Now if we run the `npm run test`command we have:

// image

Twelve tests have passed.

You can also check the code coverage by running npm run test:cov . Test coverage is a measurement of how much of your code is being tested by your automated tests. It measures the percentage of code that is executed during a test suite run.

// image

## Conclusion

Throughout this article, we have learned a bunch of things, the definition of software automation and unit testing, how to unit test a class, by mocking its external dependencies, test coverage, and some cool annotations provided by Jest.

You can find the final code [here](https://github.com/Marius-s-Aricles/unit-test-nestjs-rest-api).

I hope you have enjoyed reading this article as I enjoyed writing it for you.
