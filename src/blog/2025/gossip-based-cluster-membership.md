---
title: "A decentralized gossip-based cluster membership with Hashicorp/serf"
date: "2025-10-02"
description: ""
published: true
author: "marius niemet"
slug: decentralized-gossip-based-cluster-membership-with
categorie: distsys
---

## What is a cluster membership?
In a distributed system, multiple nodes collaborate to accomplish a specific task, forming a cluster. Cluster membership involves knowing how many nodes are part of the cluster, when a new node joins, when a node leaves, or becomes unreachable, and propagating that information to the entire cluster.

1 // img

Being able to have a view of the current cluster state is very crucial to achieving distributed tasks, like reaching a consensus. Without an accurate understanding of which nodes are alive and reachable, the system cannot reliably coordinate operations, replicate data, or elect leaders.

There are two main ways to implement cluster membership: centralized and decentralized.

### Centralized cluster state management

2 // img 

In a centralized cluster state management system, we utilize tools such as [Apache Zookeeper](https://zookeeper.apache.org/), [Consul](https://developer.hashicorp.com/consul), or [etcd](https://etcd.io/), which act as service discovery mechanisms. It becomes the single source of truth.

- When a new node joins, it registers itself with the service discovery
- The service discovery tool makes periodic health calls to check if the nodes are still alive
- Each service calls the service discovery tool to have a view of the cluster state

### Decentralized cluster membership

3 // img 

In a decentralized cluster membership, there is no single source of truth; all the nodes have a view of the cluster state.

- They communicate with each other
- Each node has a view of the cluster state
- When nodes can't reach out to a given node after some period of time, they mark it as failed and update their state

## What is gossip protocol?
A gossip protocol or epidemic protocol is a procedure or process of computer peer-to-peer communication that is based on the way epidemics or rumors spread. The best way to explain it is to take real real-life example.

Imagine we have broken glass on the floor in a room where there are several people. We don’t need everyone to notice it; it’s enough for one person to see it, inform another, and for that person to do the same, and so on. At some point, everyone will know that they have to be careful.

4 // img 

That’s exactly what I tried to illustrate in the image above. In the example, **Marius** is the one who first notices the broken glass. He informs **Meissa**, who hasn’t seen it himself, and he then shares the information with **Fatou**. Now **Fatou** knows she needs to be careful, too.

The gossip protocols attempt to replicate this behavior, which means that in a cluster, a node periodically selects another node at random and shares its information, also checking if the peer is still alive. If the peer responds, the node updates its list of active members. If it doesn’t respond, the node asks other randomly chosen nodes in the cluster to try contacting that peer. If none of them can reach it, the cluster assumes that the peer has failed and updates its state accordingly.

### What is Serf?
[Serf](https://github.com/hashicorp/serf) is a decentralized solution for cluster membership, failure detection, and orchestration built by [Hashicorp](https://www.hashicorp.com/en). It implements the [SWIM](https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf) protocol and the [Vivaldi](https://en.wikipedia.org/wiki/Vivaldi_coordinates) algorithm.

**SWIM** stands for Scalable Weakly-consistent Infection-style Process Group Membership Protocol; it's actually an implementation of the gossip protocol idea. SWIM has two main components:

- Failure Detection: periodically, a node randomly selects another node from the membership list and sends a ping. If the target responds, it's alive; if not, the node marks the target as "suspects" and asks a few other random peers to indirectly ping the target. If pings don't succeed, the node is marked as dead.
- Dissemination component: each message is spread to the rest of the cluster. When a node communicates, it includes its view of the cluster.

Vivaldi is an algorithm developed by MIT researchers. Its main purpose is to assign virtual coordinates to nodes in a cluster, creating a 2D or 3D "map" of the network. The distance between coordinates approximates the RTT, the time it takes for a network packet to travel from one node to another and back.

Serf uses Vivaldi to maintain this virtual map of the cluster. It then leverages these coordinates to optimize random peer selection during gossip: nodes can preferentially communicate with peers that are “closer” in the network, reducing latency and improving the efficiency of message propagation.

Serf can be deployed in two ways: as a Standalone Agent and as an embedded process. 

5 // img

### As a Standalone Agent (CLI / daemon)
You run the serf agent process on each host/server. Each agent joins a Serf cluster via gossip and interacts with it using the Serf CLI or RPC API. This deployment is typically used for operations and infrastructure monitoring.

### As an Embedded Go Library
You import the Serf Go library directly into your program. Each instance of the application runs its own Serf node internally and then subscribes to Serf's event channel to react to membership, failures, or events. This deployment is typically used for distributed databases, schedulers, or coordination systems.

## Implementation
For this example, we will implement an embedded HashiCorp Serf cluster using the Go library. The goal is to run multiple instances of our service and have them join together automatically to form a cluster, where each instance discovers peers and exchanges state information.

First, create a new folder and move inside it:

```
    mkdir serf-demo
    cd serf-demo
```

Create the main.go file:

```
    code main.go 
```

Initialize a new Go module:

```
    go mod init github.com/yourusername/serf-demo
```

Let’s start with a very simple main.go:

```go
    package main

    import (
    "log/slog"
    )

    func main(){
    slog.Debug("Serf cluster membership demo")
    }
```
Run it:

```
    go run main.go 
```
You should see:

```
    [INFO] Serf cluster membership demo
```
We’ll use the official Go library:

```
    go get github.com/hashicorp/serf
```

The library provides a Config struct to configure the cluster:

```go
    type Config struct {
        Nodename string 
        BindAddr string
        Tags map[string]string
        StartJoinAddrs []string
    }
```

- **NodeName**: the node name acts as the node’s unique identifier across the Serf cluster. If you don’t set the node name, Serf uses the hostname.
- **BindAddr** and **BindPort**: Serf listens on this address and port for gossiping.

Serf provides two methods used to initialize a configuration, update the main file with the content below

```go 
    conf := serf.DefaultConfig()

    conf.Init()
```

This will give us a serf's conf variable with a default value, then we can update it by assigning our own values. The value needed by the app will be provided using environment variables, so let's install the [godotenv](https://github.com/joho/godotenv) package:

```
    go get github.com/joho/godotenv
```

Now update the code:

```go
    nodeName := os.Getenv("NODE_NAME")
    nodeAddr := os.Getenv("BIND_ADDR")
    serfPort := os.Getenv("SERF_PORT")
    joinAddr := os.Getenv("JOIN_ADDR")
```

```go 
    package main

    import (
    "log/slog"
    "os"

    "github.com/hashicorp/serf/serf"
    )


    func main(){
    slog.Info("Serf demo app")

    nodeName := os.Getenv("NODE_NAME")
    nodeAddr := os.Getenv("BIND_ADDR")
    port := os.Getenv("SERF_PORT")
    joinAddr := os.Getenv("JOIN_ADDR")

    conf := serf.DefaultConfig()

    conf.Init()

    }
```
Assign the environment variables to the Serf config:

```
    conf.NodeName = nodeName
    conf.MemberlistConfig.BindAddr = nodeAddr
    conf.MemberlistConfig.BindPort = port

    events := make(chan serf.Event)
    conf.EventCh = events
```
Create the serf instance

```go
    instance, err := serf.Create(conf)

    if err != nil {
        panic(err.Error())
    }
```
Since our serf instance is up, we can start listening to events. Serf generates events whenever membership changes (nodes join, leave, fail). Let’s add an event handler goroutine:

```go 
    go func() {
        for e := range events {
        switch ev := e.(type) {
        case serf.MemberEvent:
            for _, m := range ev.Members {
            switch ev.EventType() {
            case serf.EventMemberJoin:
            fmt.Println("[JOIN] Node joined:", m.Name, m.Addr)
            case serf.EventMemberLeave:
            fmt.Println("[LEAVE] Node left gracefully:", m.Name, m.Addr)
            case serf.EventMemberFailed:
            fmt.Println("[FAILED] Node failed:", m.Name, m.Addr)
            default:
            fmt.Println("[OTHER] Event:", ev.EventType(), m.Name)
            }
            }
        }
        }
    }()
```

The first node in the cluster starts alone. Any subsequent nodes must know at least one peer to join the cluster. That’s what JOIN_ADDR is for:

```go 
    if joinAddr != "" {
    instance.Join([]string{joinAddr}, false)
    }
```

Here’s the full main.go:

```go 
    package main

    import (
    "fmt"
    "log/slog"
    "os"
    "strconv"

    "github.com/hashicorp/serf/serf"
    )

    type Config struct {
    NodeName       string
    BindAddr       string
    Tags           map[string]string
    StartJoinAddrs []string
    EventCh        chan<- serf.Event
    Logger         slog.Logger
    }

    func main() {
    slog.Info("Serf cluster membership demo")

    nodeName := os.Getenv("NODE_NAME")
    nodeAddr := os.Getenv("BIND_ADDR")
    serfPort := os.Getenv("SERF_PORT")
    joinAddr := os.Getenv("JOIN_ADDR")

    conf := serf.DefaultConfig()

    conf.Init()

    port, err := strconv.Atoi(serfPort)

    if err != nil {
    panic(err.Error())
    }

    conf.NodeName = nodeName
    conf.MemberlistConfig.BindAddr = nodeAddr
    conf.MemberlistConfig.BindPort = port

    events := make(chan serf.Event)
    conf.EventCh = events

    instance, err := serf.Create(conf)

    if err != nil {
    panic(err.Error())
    }

    go func() {
    for e := range events {
    switch ev := e.(type) {
    case serf.MemberEvent:
        for _, m := range ev.Members {
        switch ev.EventType() {
        case serf.EventMemberJoin:
        fmt.Println("[JOIN] Node joined:", m.Name, m.Addr)
        case serf.EventMemberLeave:
        fmt.Println("[LEAVE] Node left gracefully:", m.Name, m.Addr)
        case serf.EventMemberFailed:
        fmt.Println("[FAILED] Node failed:", m.Name, m.Addr)
        default:
        fmt.Println("[OTHER] Event:", ev.EventType(), m.Name)
        }
        }
    }
    }
    }()

    if joinAddr != "" {
    instance.Join([]string{joinAddr}, false)
    }

    select {}
    }
```
## Testing

Now that our cluster membership logic is implemented, we need a way to simulate multiple instances of the service. The easiest way to do this locally is by using [Docker Compose](https://mariusniemet20.medium.com/containerize-your-multi-services-app-with-docker-compose-96c26c1fb8b6).

First create a Dockerfile

```
    code Dockerfile
```

```
    # Use the official Golang base image with a specific version and distribution
    FROM golang:1.24-alpine AS builder
    WORKDIR /app
    COPY go.mod go.sum ./
    RUN go mod download
    COPY . .
    RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o serf-node main.go

    # Final image: distroless (no shell, no package manager, very small attack surface)
    FROM gcr.io/distroless/base-debian12
    WORKDIR /
    COPY --from=builder /app/serf-node .
    USER nonroot:nonroot
    ENTRYPOINT ["/serf-node"]
```
Now let’s define three services (node1, node2, node3) in Docker Compose:

```
 services: 
  node1:
    build: .
    environment:
      NODE_NAME: "node1"
      BIND_ADDR: "0.0.0.0"
      SERF_PORT: "7946"   


  node2:
    build: .
    environment:
      NODE_NAME: "node2"
      BIND_ADDR: "0.0.0.0"
      SERF_PORT: "7946"   
      JOIN_ADDR: "node1:7946"
    depends_on:
      - node1

  node3:
    build: .
    environment:
      NODE_NAME: "node3"
      BIND_ADDR: "0.0.0.0"
      SERF_PORT: "7946"   
      JOIN_ADDR: "node1:7946"
    depends_on:
      - node1
```

- **node1** is the bootstrap node. It starts the cluster, so it doesn’t need JOIN_ADDR.
- **node2** and **node3** join the cluster bootstrapped by node1.
We use depends_on to make sure they only start after node1 is up.
- Docker Compose automatically creates a network, so the hostname node1 resolves to the first container.

Build and start the cluster with:

```
    docker compose up --build
```

You should see the following logs:

First, it creates the Docker image

1 // img 

Run the services; the service node1 is the first to be run, and then initiate the cluster.

2 // img

After that, it is joined by node2 and node3.

3 // img

Now that they are all three in the cluster, they will keep exchanging messages to maintain the state.


4 // img 

We can simulate failure by stopping one node and checking the log to see how it is going to be removed from the cluster by the remaining nodes.

Find the container's ID:

```
    docker ps
```

Stop the container and check the logs:

```
    docker stop `container_id`
```

5 // img 

Node1 failed to reach out to node2, marking it as Suspect. Node3 also tried to reach out to node2, but failed. Then, after some attempts, node2 is marked as failed and removed from the cluster.

You can later bring back the node2 in the cluster by running the command below and checking our logs

```
    docker start `container_id`
```
Now node2 is back in the cluster.

6 // img

With just a few lines of Go code, we were able to set up a self-organizing cluster using Serf. Each node can automatically discover peers, detect failures, and recover when restarted, all without a central coordinator. This pattern forms the foundation for building resilient, distributed systems where nodes can join, leave, or fail at any time while the cluster continues to function.

I hope you enjoy this article as much as I enjoyed writing it.

Feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/marius-vincent-niemet-928b48182/) or [Twitter](https://x.com/mariusniemet05).
