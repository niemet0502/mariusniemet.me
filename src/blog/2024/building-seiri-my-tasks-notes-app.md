---
title: Building Seiri, my Tasks/Notes taking app
date: "2024-05-30"
description: "Explore how i built my personal app for tasks and notes"
published: true
author: "marius niemet"
slug: building-seiri-my-tasks-notes-app
categorie: project
---
For the last couple of years, I have been using [todoist](https://todoist.com/fr) to track my daily tasks and [notebag](https://github.com/pretzelhands/notebag) for my notes. Todoist was great it was missing a few features I wanted but I was overall satisfied with my experience. Notebag was a really simple app exactly what I wanted my only issue was with the automatic preview of the text editor. But (yes there is always a "but") I was still frustrated that I had to switch between two apps to manage tasks and notes so I decided to build my own app.

<img src="/articles/seiri/preview.png" alt="app screen"> <br />


That app became [seiri](https://seiri.mariusniemet.me/) a simple app you can use to manage your tasks and notes in the same place.

## What I Wanted it to do?

A few of my most important wants for the app:

- A way to switch between notes and tasks
- A markdown text editor with preview but not automatic (I'm not too fond of that)
- Organize my tasks and notes by project
- Being able to see the tasks I have completed (it wasn’t available in todoist back then)

## Finding the name

While looking for the name I described the kind of app I was building and asked chatGPT to suggest names, the first names I got were too generic like TodoApp, TaskNoteApp and I wasn’t interested, then I had an idea since I’m a big fan of the japan culture I asked to suggest names in Japanese I had a bunch of weird names but in the list, they were ‘Seiri” which is according to chatGPT:


_A Japanese word that can be translated to “organize” or “sort out” in English. It is also one of the principles of the 5S methodology, which is a workplace organization method used to improve efficiency and productivity. In the context of 5S, “Seiri” specifically refers to the process of separating necessary items from unnecessary ones and removing the latter from the workplace._

## How I made it?
Choosing the architecture was simple I knew I would build a REST API and then a Single page app for the front.

I started by designing the db schema and then building the backend. I chose [NestJS](https://nestjs.com/) I think it was my first experience with the framework.

Once I had something to consume, I first drew a wireframe of how I wanted the app to look using [Excalidraw](https://excalidraw.com/).

I ended up using create-react-app for the front, it was before it got deprecated by the React core team.

## The infrastructure
Seiri ran on my local machine for almost 8 months I was okay with that since the app was meant only for me but when I decided to open-source it, I started to think of hosting it somewhere so people could check it. The infra that runs the app is pretty simple, I have a VPS rented by Hetnzer there are Ubuntu, docker, and docker-compose installed on it. I used docker to run all the services + a nginx which is listening on port 80 then forward incoming requests to the frontend. I installed node-export, Prometheus, and Grafana for the server monitoring.

## Technologies used

Here is a recap of the tools I have used:

- NestJS
- TypeORM
- MySQL
- Redis
- React
- Docker
- Prometheus
- Grafana

## What I Learned While Building It?
I learned things while building seiri and wrote about some of them.

### Building Rest API with Nestjs
As I mentioned above I didn’t have any experience with NestJS before this app, I learned mostly by reading the documentation and watching a few YouTube videos. Then I wrote [*Building your first Rest API with Nestjs and TypeORM and test it with Postman*](https://mariusniemet.me/building-your-first-restapi-with-nestjs-and-typeorm/) an article in which I share what I have learned about building a simple Rest API with NestJS.

### Unit testing
One of my goals while building this app was to learn things that I don’t use in my daily job and unit testing on the backend side was one of them. I wrote [*Writing Unit tests for your Nestjs Rest API*](https://mariusniemet.me/writting-unit-test-for-your-nestjs-app/).

### Job queue and email sending
I had no clue about job queues and how emails are sent before working on this app I found it interesting how scaling can be handled. I wrote [*How to use Job Queue to handle email sending in your Nestjs server*](https://mariusniemet.me/how-to-use-job-queue-to-handle-email-sending/) for myself so I can come back there every time I have to reimplement the feature.

### Containerization and Docker
I had a brief idea of docker and containerization since I had a class at university about it and for the app, I learned more and wrote [*A Gentle introduction to containerization and Docker*](https://mariusniemet.me/a-gentle-introduction-to-containerization/).

## What Next?
The app is live I have been using it for more than a year now. I don’t want to add the pressure of maintaining a production app (I already have to deal with it at work please) so if you trust me enough you can use the version hosted on my server but if you don’t you can self-host it (check the [repository](https://github.com/niemet0502/Seiri) to learn how).

I’m planning to add a few features (only when it makes sense for me) but first I have to rewrite the front app and switch to React + Vite app cause I’m not satisfied with how the codebase looks right now.

## Conclusion
I enjoyed building the app, I learned during the process and honestly, I do love the feeling of using something I have built daily I think people call it “Drinking your own champagne” lool.

I hope you check out [the demo](https://seiri.mariusniemet.me/) and play around with it! I encourage you to build a project if you have an idea because it’s fun and you’ll learn a lot along the way.