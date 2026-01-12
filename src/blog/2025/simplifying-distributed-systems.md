---
title: "Simplifying key distributed systems terms: demystifying the jargon"
date: "2025-08-18"
description: ""
published: true
author: "marius niemet"
slug: simplifying-key-distributed-systems-terms
categorie: distsys
---
The field of distributed systems is notoriously challenging. For beginners, getting started can feel overwhelming, and reading books or articles often makes it worse, thanks to the dense jargon and specialized terminology. That’s why I’ve decided to write this article: we’ll start by defining what a distributed system is, explore why we build them, and break down key concepts to make the subject more approachable.

## What is a distributed system?
In its most basic form, a computer can perform two primary tasks: computation and storage. A distributed system is the art of solving the same problem that can be solved on a single computer using multiple computers. In a distributed system, if a function is responsible for performing a computation to produce a result, that function can be executed across multiple computers called nodes working together to achieve the same goal.

1 // img 

Similarly, if the task is to store data, that data can be distributed and saved across multiple nodes, allowing the system to maintain redundancy, balance load, and improve fault tolerance.

2 // img 

## Why are distributed systems hard?
Building a distributed system means that you have to deal with two constraints:

- The number of nodes
- The distance between nodes

Working within those constraints:

- **More nodes increase the likelihood of failure:** As the number of independent nodes grows, the probability that at least one node will fail also rises, which can reduce overall system availability and increase administrative complexity.
- **More nodes require more communication:** Adding nodes often increases the need for coordination and message exchange between them, which can reduce performance as the system scales.
- **Greater geographic distance increases latency:** Nodes that are physically far apart face higher minimum communication delays, which can slow down certain operations and reduce system performance.

## Why do we build distributed systems?
Distributed systems are one of those rare fields where the best advice from experts is: "Don’t build one… unless you have no alternative". Why, then, do companies still build distributed systems? Because they enable capabilities that are hard or outright impossible to achieve with a single computer. Capabilities like:

### Availability (Fault tolerance)
Fault tolerance refers to a system's ability to function properly despite the occurrence of faults. A single machine cannot tolerate any failures since it either fails or doesn’t. To build a fault-tolerant system, engineers introduce redundancy by having multiple nodes, so that if one fails, the others can still serve the application.

### Low latency

The state of being latent; delay, a period between the initiation of something and the occurrence. Latency is the time between when something happens and the time it has an impact or becomes visible. While building a system, there is a minimum latency we can't avoid, which is the speed of light how fast the information can move from one point on the globe to another.

A distributed system mitigates this by placing nodes closer to users, reducing the physical distance information must travel, and thus lowering latency.

// 3 img

Instead of reaching out to a node that is distant from the user location, we bring it closer to reduce the minimum latency.

### Scalability
In a scalable system, as we move from small to large, things should not get incrementally worse. A scalable system continues to meet the needs of its users as scale increases.

### Performance
When we talk about performance, one key measure is throughput — the amount of work a system can process in a given time. A distributed system improves throughput by spreading the workload across multiple nodes. Each node handles part of the total work in parallel, so adding more nodes can increase the overall processing capacity.

4 // img 

## Distributed systems jargon or concepts to know

### Partition or Network Partition
Not to be confused with database partitioning, a network partition occurs when nodes in a distributed system become unreachable from each other due to network failures. This creates separate groups of nodes, where a node in one group cannot communicate with nodes in the other.

5 // img 

A network partition is different from a node crash, as the nodes may still be running normally but are isolated by the network.

6 // img 

## Replication
Replication involves making copies of the same data on multiple machines, allowing more servers to participate in the computation. It improves

- performance by making additional computing power and bandwidth available to a new copy of the data
- availability by creating additional copies of the data, increasing the number of nodes that need to fail before availability is sacrificed

7 // img 

In the image above, the files "file 1" and "file 2" are replicated to our three nodes. Every node that has data is called a replica. This setup allows us to achieve:

- Scalability
- Performance
- Fault Tolerance

The system can continue operating when components fail, serve requests from geographically distributed locations, and balance load across multiple machines. Replication is great, but it is also the source of many problems since there are now independent copies of the data we have to keep in sync on multiple machines.

### Consistency

In a replicated system, a data file (for example) is stored across multiple nodes. At any given moment, different nodes might hold slightly different versions of that file. Consistency, or the consistency model, defines what behavior a client can expect when reading data: will they always receive the most recent version regardless of which node they read from, or could they receive stale data for some period of time?
There are multiple consistency models, like:

- **Strong** consistency: after a write completes, any subsequent read — no matter which node it comes from will always return the most recent value.
- **Weak** consistency: after a write completes, there is no guarantee that subsequent reads will return the latest value. Clients may temporarily see stale data until the updates propagate to all replicas.

And for each model, we have different types:

8 // img 

This list is not exhaustive. You can read [this](https://antithesis.com/resources/reliability_glossary/#consistency-models) to learn more. 

### Quorum
In a replicated system, consistency is maintained by synchronizing all replicas whenever data changes. Typically, the node that receives the update must replicate it to the other nodes in the cluster before sending an acknowledgment to the client. The problem with this approach is that if even one node is unreachable, the update cannot be replicated to all nodes, meaning that every node must be available to accept a write request, a significant constraint. To address this, engineers use a quorum. In a distributed system, a quorum is the minimum number of replicas that must complete an operation before it is considered successful.

The type of quorum chosen depends on the trade-offs engineers make, usually balancing availability and consistency. There are two common types: sloppy (or partial) quorum, which requires only a subset of nodes to respond, and strict (or majority) quorum, which requires a majority of nodes to acknowledge an operation before it is considered successful.

For the majority quorum, engineers often prefer an odd number of nodes, since more than half of the nodes must agree to complete an operation. With an odd number, it’s always clear which side has the majority, avoiding ties.

9 // img 

In a sloppy (or partial) quorum, the number of nodes required is typically less than a majority, and it’s defined based on the system’s desired balance between availability and consistency. The exact number is usually defined by engineers as a parameter, often called W for writes and R for reads in quorum-based systems.

### Consensus
In a replicated system, where data is stored across multiple components, there must be a mechanism for all nodes to agree on the value of the data to ensure consistency across the cluster. The mechanism used to achieve this agreement is called a consensus algorithm.

There are multiple consensus algorithms, and the choice of which to use depends on the characteristics of the system, such as availability, consistency, and fault tolerance. Examples include: [Paxos](https://en.wikipedia.org/wiki/Paxos_(computer_science)), [Raft](https://raft.github.io/raft.pdf), [Two-Phase Commit (2PC)](https://en.wikipedia.org/wiki/Two-phase_commit_protocol), etc.

### The CAP Theorem
It’s a theorem that helps to formalize the trade-offs that distributed systems must make when dealing with network partitions.

The theorem states that of these three properties:

- Consistency: Ensuring all nodes always return the latest data, even if it means rejecting some requests during a partition.
- Availability: Ensuring every request gets a response, even if the response may be outdated due to partitioning.
- Partition tolerance: the system continues to operate despite message loss due to network and/or node failure

10 //img 

The theorem states that the three aren’t achievable, which means we end up with the following type of system:

- **CA**: Examples include full strict quorum protocols, such as two-phase commit.
- **CP**: Examples include majority quorum protocols in which minority partitions are unavailable, such as Paxos.
- **AP**: Examples include protocols using conflict resolution, such as Dynamo.

## Conclusion
And that’s a wrap! I hope this post was helpful. If you found this interesting, I have more articles coming up very soon.

Feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/marius-vincent-niemet-928b48182/) or [Twitter](https://x.com/mariusniemet05).