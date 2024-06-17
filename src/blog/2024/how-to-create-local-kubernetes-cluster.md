---
title: How to create a local Kubernetes cluster with Kind
date: "2024-06-17"
description: "In this blog, we will learn how to create a local kubernetes cluster with Kind"
published: true
author: "marius niemet"
slug: how-to-create-local-kubernetes-cluster
categorie: infra
---
While developing apps that will live in a [Kubernetes](https://mariusniemet.me/containers-orchestration-and-kubernetes/) environment it’s always better to have a local cluster to test our app or to debut issues. In this article, we will learn how to create a local Kubernetes cluster using [kind](https://kind.sigs.k8s.io/).


[Kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker) is a tool for running local KWhile developing apps that will live in a [Kubernetes](https://mariusniemet.me/containers-orchestration-and-kubernetes/) environment it’s always better to have a local cluster to test our app or to debut issues. In this article, we will learn how to create a local Kubernetes cluster using [kind](https://kind.sigs.k8s.io/).


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/caily50pau2tewkoe33z.png)

[Kind](https://kind.sigs.k8s.io/) (Kubernetes in Docker) is a tool for running local Kubernetes clusters using Docker container “nodes”. kind was primarily designed for testing Kubernetes but may be used for local development or CI.

## Installation
Depending on your OS you can check the documentation [here](https://kind.sigs.k8s.io/). If you are on Windows like me you can:
- Install with A Package Manager [chocolatey](https://chocolatey.org/install). Once chocolatey is installed run the command below:
```
choco install kind
```
- Install from release binaries with PowerShell
```
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.23.0/kind-windows-amd64
Move-Item .\kind-windows-amd64.exe c:\some-dir-in-your-PATH\kind.exe
```
Since Kind leverages docker, you will need to have docker installed on your machine or you can let Kind install it for you during the process. You can run the command below to check if it has been successfully installed.

```
kind --version
```


## Creating a cluster
Once you have Kind installed we create a cluster by running the command below:
```
kind create cluster
```
It will create and run a docker container on your machine, that container will act as the control plane of your cluster and all the control plane components will be installed in it. Run the command below to check the containers that are currently running:
```
docker ps 
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kb7ftadbo6u34dy93d7d.png)

We have one container running with the name kind-control-plane, this is our first cluster. It’s a cluster with a single node that will act as a node and control plane as well.

### Cluster with a name
The cluster created above has the name `kind` which is the name by default but we can create a new cluster and specify a different name:

```
kind create cluster --name second-cluster
```



![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k8l4vhwxi44mut4es1qo.png)

Now we have two clusters, the first is kind the second second-cluster.

### Cluster with multiple nodes
In production most of the time we have multiple nodes for running our apps, it’s always better to have the same infra locally for testing. Kind allows us to create a cluster with multiple nodes (control plane and worker nodes), to do that we have to create a file to specify the configuration.

```
# three node (two workers) cluster config
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
```
Create a file named `kind-example-config.yaml` copy and paste the content above then run the command below:

```
kind create cluster --config kind-example-config.yaml
```


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3y4vw1gcw9i8cs3025wn.png)

The cluster has been successfully created and you can see from the image below we have three containers running, the control plane, and two workers nodes.


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xl0mzve1kvo7jyvdlk0l.png)

You can expose extra ports for the worker nodes so they can be accessible from the machine, to do that you have to update your configuration:

```
apiVersion: kind.x-k8s.io/v1alpha4
kind: Cluster
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 30000
    hostPort: 30000
    listenAddress: "0.0.0.0" # Optional, defaults to "0.0.0.0"
    protocol: tcp # Optional, defaults to tcp
  - containerPort: 31321
    hostPort: 31321
  - containerPort: 31300
    hostPort: 31300
- role: worker
- role: worker
```

## Deleting a cluster
You can delete a cluster by running the command below:

```
kind delete cluster
```
If the cluster’s name is mentioned, it will delete the default cluster the one that has the name `kind`

```
kind delete cluster --name second-cluster
```


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xkvezmb26fgwx7zzw9io.png)

### Interact with the cluster
Once kind is installed we can already use the `kubectl` commands:
```
kubectl get node
```
If you have multiple clusters on your machine you have to specify the name of the cluster as context for each command:

```
Kubectl get nodes --context kind-kind-2 
# or 
kubectl get nodes --context kind-second-cluster
```

## Load docker images
One of the advantages of having a local cluster is that we don’t need to host our images in a registry to use them in Kubernetes Deployment. But since our nodes are running inside containers we have to make our images available inside those containers so they can be used. To do that Kind provide a command to load images into the cluster nodes:

```
kind load docker-image my-image-name:tag
```
This will make the image `my-image-name` available for use in the cluster.

## Install Helm
From now we have a working Kubernetes cluster, we might need Helm to easily install packages. According to your OS check the [documentation](https://helm.sh/docs/intro/install/). If you are on Windows like me you can install it by using chocolatey.

```
choco install kubernetes-helm
```


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5x9e0psz0e5l1j8dzev7.png)

```
helm version
```


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fo4gn2wmvvt6n58vhgca.png)

### Install nginx using Helm
- Add and update the repo:
```
helm repo add stable https://charts.helm.sh/stable
helm repo update
```

- Install Nginx

```
helm install my-nginx stable/nginx-ingress
```

- Get the pods list 


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ynq1c7zb61puapsjyo68.png)

- Get the services list 


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ainh2kpl1ior8pyuybza.png)

We have nginx running inside our cluster.

## Conclusion
Throughout the article, we have discovered what is Kind and how to create a Kubernetes cluster for local development. In the next article, we will learn how to deploy our first app in Kubernetes.

I hope you enjoy this article as much as I enjoyed writing it.

Feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/marius-vincent-niemet-928b48182/) or [Twitter](https://twitter.com/mariusniemet05).