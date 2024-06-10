---
title: "Containers Orchestration and Kubernetes"
date: "2024-06-10"
description: "Managing a multitude of containers can quickly become complex and unwieldy. This is where container orchestration comes into play. In this article, we will do a quick overview of the challenges"
published: true
author: "marius niemet"
slug: containers-orchestration-and-kubernetes
categorie: infra
---
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qazg498ehseck03wiylm.png)

In my previous articles, we learned about [containers](https://mariusniemet.me/a-gentle-introduction-to-containerization/) and how to create a stack for your [multi-container app using docker-compose](https://mariusniemet.me/containerize-your-mutil-container-app-with-docker-compose/). However, managing a multitude of containers can quickly become complex and unwieldy. This is where container orchestration comes into play. In this article, we will do a quick overview of the challenges that can be handled using an orchestration tool and then introduce Kubernetes, its role, and its components.

## What is container orchestration?

Once the containers are running, container orchestration tools automate life cycle management and operational tasks based on the container definition file, including:

- Deployment: your app is running in production and you want to deploy a new version without downtime.
- Scaling up: you have a peak load at a certain time of the day you want your app to handle that load by automatically adding instances of your app and servers.
- Scaling down: once the load has decreased the resources should be removed as well to avoid paying for unnecessary machines.
- Performance and Health: your app is made by multiple services communicating with each other, if one of them fails you should be able to notice and restart the service.
- Networking: exposing your services to the end user and handling the communication between the internal services with load balancing.

Even though this article will be focused on Kubernetes I want to mention that there are multiple container orchestration platforms such as [Mesos](https://mesos.apache.org/), [Docker Swarm](https://docs.docker.com/engine/swarm/), [OpenShift](https://docs.openshift.com/), [Rancher](https://www.rancher.com/), [Hashicorp Nomad](https://www.nomadproject.io/), etc.

## What is Kubernetes?
Kubernetes is a platform built by Google for container orchestrations. It aims to provide automated solutions for all the challenges mentioned before such as deployment, horizontal scaling, performance and health monitoring of the application, etc.

Kubernetes has multiple components that work together in order to orchestrate the app's load.

### Control plane

The control plane is responsible for running the Kubernetes cluster and it has its components.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a84hqmgvg6ppbnrcun9z.png)

Each component plays a role within the control plane:

- **etcd:** it’s a fault-tolerant and distributed key-value store that stores the cluster state and configuration.
- **API Server:** exposes the API used to interact with the cluster and the internal and external requests.
- **Scheduler:** is responsible for scheduling new pod creation and deciding in which worker node they will be run.
- **Controller:** It monitors the current state of the cluster and takes action to move that state to the desired state. It runs separate processes such as node controller, replica, Endpoint, service account, and token controller.
- **Cloud manager controller:** it can embed cloud-specific control logic, such as accessing the cloud provider’s load balancer service. It enables you to connect a Kubernetes cluster with the cloud provider's API. Additionally, it helps decouple the Kubernetes cluster from components that interact with a cloud platform, so that elements inside the cluster do not need to be aware of the implementation specifics of each cloud provider.

### Node
Nodes are virtual or physical machines responsible for running the application instances. Each node has a bunch of components running in it.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/msz80ddj66rcy87el6tt.png)

- **Kube Proxy:** it communicates with the Kubernetes control plane and allows network communication to pods between pods.
- **Kubelet:** it’s the tool responsible for running the state on each node, checking container health, and taking action.
- **Container runtime:** each node needs a container runtime to run containers, it can be docker or any other runtime.
- **Container Networking:** Container networking enables containers to communicate with hosts or other containers.
- **Pod:** it’s the smallest unit Kubernetes allows to interact with. Inside a POD we can run containers.

### Cluster
A Kubernetes cluster is the collection of the control plane with its worker nodes. A cluster can scale up to 5000 worker nodes.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3nete589lx7y6nwcfayf.png) 

## Kubernetes Objects
Kubernetes objects are persistent entities in the Kubernetes system. They represent the state of the cluster, once an object is created and applied Kubernetes will work to ensure that the current state is equal to the desired.

- **Volume:** At its core, a volume is a directory, possibly with some data in it, accessible to the containers in a pod.
- **Service:** it’s a method used to expose an app within the cluster.
- **Namespace:** it’s a way to create an isolated collection of resources within the cluster. Names of resources need to be unique within a namespace, but not across namespaces.
and pods which we have already introduced in the previous section.


## Helm package manager
With Kubernetes, Helm serves as a package manager, working similarly to npm in Node.js and yum in Linux. Helm deploys charts as complete and packaged Kubernetes applications, which include pre-configured versioned application resources. It is possible to deploy different chart versions by using different configuration sets.

## Conclusion
In conclusion, we have explored the basics of container orchestration, the fundamentals of Kubernetes, its architecture, and its key components. We have also covered its basic objects and introduced Helm the package manager.

I hope you enjoy this article as much as I enjoyed writing it.

Feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/marius-vincent-niemet-928b48182/) or [Twitter](https://twitter.com/mariusniemet05).
