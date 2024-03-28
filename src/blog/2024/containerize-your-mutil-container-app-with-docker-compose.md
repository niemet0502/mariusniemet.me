---
title: Containerize your multi-services app with docker compose
date: "2024-03-28"
description: "In this blog, we aim to show how to containerize a multi-container app using docker-compose."
published: true
author: "marius niemet"
slug: containerize-your-mutil-container-app-with-docker-compose
categorie: infra
---
In this [previous article](http://localhost:8000/a-gentle-introduction-to-containerization/), we learned what a container is and took a brief introduction by learning how to create an image and then run a container, it was a good starting point.

But with the new industry standard most of the time you will work on apps made by multiple services that have dependencies between them, frontend, backend, database, caching, queue, and so on.

## Project architecture


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/eeofwqcg74xi66tizk3b.png)

The image above describes the architecture of the project we want to containerize, as you can see we have four different services

- **Front:** a single-page app built with [React](https://fr.react.dev/)
- **Back:** a graphQL server built with [Nestjs](https://nestjs.com/)
- **Database:** a [MySQL](https://www.mysql.com/fr/) db
- **Cache:** a [Redis](https://redis.io/) cache

If you want to follow along you have to download the source code here.

## What is docker compose? 
Docker Compose is a tool for defining and running multi-container applications. Compose simplifies the control of your entire application stack, making it easy to manage services, networks, and volumes in a single, comprehensible YAML configuration file.

## How to create a stack? 
First, you have to create a Dockerfile for each custom service (service for which you are responsible for building the image), for our current project, we have to create a Dockerfile for the front and back services.

### Front 
```
cd client
```

create a file named Dockerfile and add the content below:

```
FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]
```

### Back
```
cd graphql-server
```

create a file named Dockerfile and add the content below:

```
FROM node:16-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

FROM base AS dev
# Install dependencies
RUN npm install 

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start app
CMD ["npm", "run", "start:dev"]

FROM base as prod 
ENV NODE_ENV production 

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
```

### The compose file
Once we have the Dockerfile for our services the next step is to create a `compose.yaml` file, docker compose relies on that file for the stack configuration. Compose also supports `docker-compose.yaml` and docker-compose.yml for backward compatibility with earlier versions. If both files exist, Compose prefers the canonical `compose.yaml`.

```
name: composeintroduction
```

If you don’t set a name compose will use the name of the directory in which the compose file is located.

### Services 
A service is an abstract definition of a computing resource within an application. A service is defined by a Docker image and a set of runtime arguments (mostly docker run arguments). While creating a service you can use an existing image by setting the image name and tag compose will fetch it from the registry for you or you can ask compose to build a new image for you by specifying the path to the Dockerfile.

Let’s create the compose service for the backend:

```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
```

`services` is a top-level argument and all our services will be declared here.

First, we have the service name in this case it’s `backend` and since for that service, we won’t rely on an existing image we have to specify how compose should build the image that’s the role of the `build` section, `context` is used to specify the subfolder in which the Dockerfile is located and the `dockerfile` argument is to specify the name. If your file is named Dockerfile you can remove that argument but if the name is different for any reason you have to specify it.

If your Dockerfile uses a multi-stage build you can specify the stage you are targeting and the command you want docker-compose to run inside your container once it’s ready.

```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
```

From now we will have a service named `backend` that will be built using the Dockerfile inside the `graphql-server` subfolder, the target stage will be dev and the command used will be `npm run start:dev`

**Port definition:**

As we have mentioned above all the arguments you usually pass to the docker run command are available here so to define ports for our container we use the syntax below:

```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      -"3000:3000"
```

The port at the left is the external accessible on the host machine and the right is the port inside the container (the same exposed in the Dockerfile).

**Environnment variable**

There are multiple ways to pass environment variables to a service:

- **By using a file:** An .env file in Docker Compose is a text file used to define environment variables that should be made available to Docker containers when running docker compose up. This file typically contains key-value pairs of environment variables, and it allows you to centralize and manage configuration in one place.

The .env file content:

```
DB_PASSOWORD=password
DB_USERNAME=user
```
```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      -"3000:3000"
    env_file:
      - .env
```

- **By passing key-value directly:** There are two syntaxes for that

```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      -"3000:3000"
    environment:
      DB_PASSWORD: password
      - DB_USERNAME=user
``` 

It’s up to you to choose the way you want to set variables, for the rest of this article we will use the syntax below:

```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      -"3000:3000"
    environment:
      DB_PASSWORD: password
      DB_USERNAME: user
```

Now let’s create the service for the database.

```
services: 
   database: 
      image: mysql:latest
      environment: 
        MYSQL_ROOT_PASSWORD: password
        MYSQL_DATABASE: db
        MYSQL_USER: user
        MYSQL_PASSWORD: password
```

For the database service, since we will use the MySQL official image we don’t need the build section here, compose will fetch the image with the tag `latest` for us from the registry.

Last update the compose file by adding the remaining services:

```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      - "3000:3000"
    environment:
      DB_PASSWORD: password
      DB_USERNAME: user

  database: 
    image: mysql:latest
    environment: 
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    
  cache: 
    image: redis:latest
    ports:
    - "6380:6379"

    
  frontend: 
    build: 
      context: ./client
      dockerfile: Dockerfile
    command: npm run dev
    ports: 
    - "5173:5173"
```

Now we have added the frontend service and the cache service. We can now run our stack. First, we have to build the images by calling the command below inside our project’s folder :

```
docker compose build
```
Then compose will build the backend and the frontend image by using the specifications we have added in the compose file, your terminal should display something like the image below:


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iqry2gs9d8byndc9lcn1.png)

Once the images are built you can run the stack by calling the command below:

```
docke compose up -d 
``` 

The flag -d is for running the command in detach mode. By running this command compose will run all the containers declared in the compose file, for the backend and frontend compose will use the images built first for the database and the cache compose will fetch the images from the registry.

If everything went well you should have the result below just make sure the ports we have exposed aren’t used by other containers on your machine.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/newjbm4l5q8upr00ud0t.png)

Each container’s name includes the stack name, the service name, and a number. Here we have one since there is only one instance by service.

### Communication

Once we have our services running we want to establish communication between them, the backend should talk to the database and the cache, and the frontend should talk to the backend.

There are two things to consider here:

- The first is that compose creates a default network for your entire stack if you pay attention to the image above you have the first line `Network composeintroduction_default` that shows the name of the default network.
- The second is that compose comes with a DNS so if your services are in the same network you can use the service name + the port to communicate compose will figure out the IP address of the service you want to communicate with.

Based on these two pieces of information we understand that we can already establish the communication between our services just by using the service name, let’s update the backend first:

```
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'database',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*entity.js'],
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'cache',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
``` 

Then the front:

```
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const client = new ApolloClient({
  uri: "http://backend:3000/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
```

Now if we rebuild our images using `docker compose build` then run the containers using `docker compose up -d` we can access the frontend at `http://localhost:5174` and fetch the data from the backend that will communicate with the cache and the database.

You may think that everything is great since our services can communicate with each other but we have a tiny issue here, all our services are inside the same default network exposed externally which means we can access the db, the cache, and the backend from the host machine which is something we don’t necessarily like, the idea is to have something like the image below:


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iowjt985i91smwl5kkvj.png)

Here we have two networks, `public` which is accessible from the host machine and `private` which is accessible only internally. Since the frontend will be accessed from the host and will communicate with the backend it should be inside the two networks.

Now let’s see how to do that in compose:

First, we start by adding a new top-level section named `networks` all the networks have to be declared there then we add two entries `public` and `private` which are the names of our networks. The private should have a parameter name internal set to `true` which will tell compose to not expose those services outside.

```
networks:
  public: 
  private: 
    internal: true
```

Once our networks are declared the last thing to do is to update the services definition by adding a network section:

```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      - "3000:3000"
    environment:
      DB_PASSWORD: password
      DB_USERNAME: user
    networks:
      - private

  database: 
    image: mysql:latest
    environment: 
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    networks:
      - private
    
  cache: 
    image: redis:latest
    ports:
    - "6380:6379"
    networks:
      - private

    
  frontend: 
    build: 
      context: ./client
      dockerfile: Dockerfile
    ports: 
    - "5173:5173"
    networks:
      - private 
      - public

networks:
  public: 
  private: 
    internal: true
```

We have added a network section for each service and only the frontend service has two networks now the services inside the private network can’t be accessed from the host. Note that the names `private` and `public` are not mandatory you can give any name you want the thing that makes the network private is the `internal: true`

### Persistent volume 
If we don’t want to lose our database and cache data each time the services are started we have to create volumes and assign them to the services.

The top-level volumes declaration lets you configure named volumes that can be reused across multiple services let’s do it :

```
volumes:
  db-data: 
  cache-data:
```

Then update the services definition:

```
cache: 
    image: redis:latest
    ports:
    - "6380:6379"
    networks:
      - private
    volumes:
      - cache-data:/data
database: 
    image: mysql:latest
    environment: 
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    networks:
      - private
    volumes: 
      - db-data:/var/lib/mysql
```

Once the volumes are declared and assigned to the services we can restart the stack how many times we want the data won’t be lost.

## Startup order 
When we run the `docker compose up` command, from the logs printed we can see in which order the services are started


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mju8xudc3140os6ogsbc.png)


We can notice that the order is the following cache, database, frontend then backend but there are two issues here:

- First, the order won’t always be the same
- Second, the front will be available before the backend although it is the first that calls the second.
To fix these issues compose provides an attribute nameddepends_on available for each service that will be used to control the startup and shutdown order.

The depends_on attribute takes a list of services for which the current service depends and for each service, we have to set a condition that can be `service_started` or `service_healthy` .

Let’s update the backend service then explain:

```
backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      - "3000:3000"
    environment:
      DB_PASSWORD: password
      DB_USERNAME: user
    networks:
      - private
    depends_on:
      database:
        condition: service_started
      cache:
        condition: service_started
```

We have updated the backend service definition by adding the `depends_on` attribute. We have added two dependencies the database and the cache. Their condition is `service_started` that means compose will run the backend container only if the database and the cache have been already started.

Now let’s update the frontend service:

```
frontend: 
    build: 
      context: ./client
      dockerfile: Dockerfile
    ports: 
    - "5173:5173"
    networks:
      - private 
      - public
    depends_on:
      backend: 
        condition: service_healthy
```

Here the condition is `service_healthy` which is different than `service_started` the idea is to give the developers more control over when a dependency can be considered ready to receive requests cause having the backend started doesn’t always mean it’s ready to receive requests.

Now we have to define how compose will define if the backend service is healthy and to do that we are going to update the backend service definition by adding a new attribute named `healthcheck` :

```
backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      - "3000:3000"
    environment:
      DB_PASSWORD: password
      DB_USERNAME: user
    networks:
      - private
    depends_on:
      database:
        condition: service_started
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://backend:3000/healthcheck"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s
```

When a container has a healthcheck specified, it has a health status in addition to its normal status. This status is initially `starting`. Whenever a health check passes, it becomes `healthy` (whatever state it was previously in). After a certain number of consecutive failures, it becomes `unhealthy`. The value of the `test` attribute can be whatever you want here we are making an HTTP request since it’s a web service but for example, in the case of a database, you can replace it with a mysql ping command.

The final compose.yaml file should look like this:

```

name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      - "3000:3000"
    environment:
      DB_PASSWORD: password
      DB_USERNAME: user
    networks:
      - private
    depends_on:
      database:
        condition: service_started
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://backend:3000/healthcheck"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s

  database: 
    image: mysql:latest
    environment: 
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    networks:
      - private
    
  cache: 
    image: redis:latest
    ports:
    - "6380:6379"
    networks:
      - private

    
  frontend: 
    build: 
      context: ./client
      dockerfile: Dockerfile
    ports: 
    - "5173:5173"
    networks:
      - private 
      - public
    depends_on:
      backend: 
        condition: service_started

networks:
  public: 
  private: 
    internal: true
```

## Secrets 

A secret is a blob of data, such as a password, SSH private key, SSL certificate, or another piece of data that should not be transmitted over a network or stored unencrypted in a Dockerfile or your application’s source code.

To use a secret in our compose stack we have to do the following actions:

First, declare the secret by using the `secrets` top-level element. The source of the secret is either `file` or `external`.

```
secrets:
  my_certificate: 
    file: ./basic-certificate.cert
```
Second, grant the access to the secret for the frontend service

```frontend: 
    build: 
      context: ./client
      dockerfile: Dockerfile
    ports: 
    - "5173:5173"
    networks:
      - private 
      - public
    depends_on:
      backend: 
        condition: service_started
    secrets: 
      - my_certificate
```
The final compose file should look like this:

```
name: composeintroduction

services: 
  backend:
    build:
      context: ./graphql-server
      dockerfile: Dockerfile
      target: dev
    command: npm run start:dev
    ports:
      - "3000:3000"
    environment:
      DB_PASSWORD: password
      DB_USERNAME: user
    networks:
      - private
    depends_on:
      database:
        condition: service_started
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://backend:3000/healthcheck"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s

  database: 
    image: mysql:latest
    environment: 
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    networks:
      - private
    
  cache: 
    image: redis:latest
    ports:
    - "6380:6379"
    networks:
      - private
    volumes:
      - cache-data:/data

    
  frontend: 
    build: 
      context: ./client
      dockerfile: Dockerfile
    ports: 
    - "5173:5173"
    networks:
      - private 
      - public
    depends_on:
      backend: 
        condition: service_started
    secrets: 
      - my_certificate

secrets:
  my_certificate: 
    file: ./basic-certificate.cert

volumes:
  db-data: 
  cache-data:

networks:
  public: 
  private: 
    internal: true
```

## Conclusion

We have come to the end of this article that aimed to show how to containerize a multi-container app using docker-compose. You can find the final version of the project here. Don’t hesitate to check the compose documentation there are a lot of fun things to discover like [working with multiple compose files](https://docs.docker.com/compose/multiple-compose-files/) or [docker-compose watch](https://docs.docker.com/compose/file-watch/).

I hope you enjoy this article as much as I enjoyed writing it.

Feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/marius-vincent-niemet-928b48182/) or Twitter.




