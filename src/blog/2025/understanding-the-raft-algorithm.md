---
title: "Understanding the Raft algorithm: My notes from the paper"
date: "2025-10-27"
description: ""
published: true
author: "marius niemet"
slug: understanding-the-raft-algorithm
categorie: infra
---

Raft is a consensus algorithm widely used in modern distributed databases to manage replication and leader election. It’s implemented in projects like [etcd](https://etcd.io/), [Consul](https://developer.hashicorp.com/consul), and [RQLite](https://rqlite.io/), making it a great choice for studying and understanding. To deepen my knowledge, I’ve been reading the original Raft paper. Here, I’ll summarize my notes and explain the algorithm in my own words.

## Introduction

The Raft algorithm was published in a paper titled [*"In Search of an Understandable Consensus Algorithm"*](https://raft.github.io/raft.pdf) by Diego Ongaro and John Ousterhout from Stanford University. Their main goal was to find a new approach to solving the consensus problem, with a focus on being understandable by both professionals and students. This differs from the Paxos algorithm by Leslie Lamport, which is known to be difficult to understand and even more challenging to implement.

1 // img

The principle of the algorithm is the following: we want to ensure strong consistency in our cluster of nodes, so the first thing to do is to prevent nodes in the cluster from diverging. To do that, we make sure that only one node in the cluster can receive write commands from the client; that node is called the LEADER, and the remaining FOLLOWERS. To be able to prevent failure, we ensure that we have an odd number of nodes and allow our system to receive writes as long as we have to majority of nodes available.

## Components
Each node in the cluster has three components: a log, a consensus module, and a state machine.

2 // img

**Consensus module:** receive commands (A command is the client’s request operation that modifies the replicated state machine. It’s usually a write operation) and add them to the log.

**Log:** store all the commands in the log. Each log entry has three attributes: the term (related to the leader), the index (the position of the log), and the command sent by the client.

3 // img

**State machine:** apply the commands in the right order to update the local state.

## Node status
There are three possible statuses for each node in the cluster: leader, follower, and candidate.

4 // img 

**Leader:** There is only one node that acts as the leader in the entire cluster. It's the only node allowed to receive write operations and is responsible for replicating commands to all followers within the cluster.

**Follower:** Their role is to receive commands from the leader, store them in their logs, and then apply them in their state machine once the commit is approved by the leader. In some configurations, they can serve read commands from the client.

**Candidate:** When a follower node doesn't receive any commands from the leader for a given period of time, it assumes that there is no leader anymore, then it updates its status to "Candidate" and triggers an election process by asking all the nodes in the cluster to vote for it as the new leader.

## Protocol methods

The algorithm is based on two RPC calls: RequestVote and AppendEntries:

**RequestVote:** It is sent by the candidate when it has started the election process and asks the nodes in the cluster to vote for it. The call includes the following arguments:

- **term:** candidate’s term
- **candidateId:** candidate requesting vote
- **lastLogIndex:** index of candidate’s last log entry
- **lastLogTerm:** term of candidate’s last log entry

**AppendEntries:** It is sent by the leader to replicate entries or for heartbeats. The call includes the following arguments:

- **term:** leader's term
- **leaderId:**
- **prevLogIndex:** the last log that should have been processed by the follower
- **entries[]:** log entries to store (empty for - heartbeat; may send more than one for efficiency)
- **leaderCommit:** the leader’s commitIndex (the index of the highest log entry known to be committed)

## Leader election
Raft is a single-leader algorithm, which means that for a given period of time, also called a term, only one server in the cluster is responsible for receiving commands from the client.
As in democratic countries, a leader is elected for a certain period of time, and this period of rule is called a term of office. In the Raft world, a term is used to track the time a given server operates as a leader. When the leader fails, or when a server in the cluster can’t reach out to the leader, a new election is started. After a successful election, a single leader manages the cluster until the end of the term. Some elections fail, in which case the term ends without choosing a leader. The term is also used as a global clock to track information. The term is materialized by a number that increases monotonically over time. Each server in the cluster stores that number, sends it when it communicates with the other server, but also compares it with it received a message from another server. If the server’s current term is less than the term received, it automatically updates itself.

Now, let's see what the leader election process is:

5 // img

Firstly, new nodes join the cluster as followers and stay in that state as long as they receive heartbeat or logs from the leader. When a node didn’t receive updates from a leader for a given period of time, it starts an election, which means:
- Update its status to Candidate
- Increment its term
- Vote for itself
- Reach out to the entire cluster, asking them to vote for him. The RequestVote RPC call.

A leader election process can end up in different ways:

**Candidate wins:** The candidate receives a majority of votes from the cluster and becomes the leader. It then begins sending heartbeat messages to all other nodes to establish its authority and prevent new elections.

**The candidate discovers a leader with a greater term:** During the election process, the candidate may still receive AppendEntries RPCs from other nodes. If one of these messages contains a term higher than its own, the candidate updates its term and reverts to the Follower state.

**The candidate loses:** If the candidate fails to receive a majority of votes, it loses the election, updates its current term if necessary, and returns to the Follower state.

**No candidate wins the election:** If many followers become candidates at the same time, votes could be split so that no candidate obtains a majority. When this happens, each candidate will time out and start a new election by incrementing its term and initiating another round of Request-Vote RPCs.

## Replication
Once a node is elected as the Leader, it starts receiving write commands from the client. For each new command, the leader stores it as an entry in its logs, replicates the log in each follower in the cluster, and then waits for acknowledgment from them.

6 // img 

Once the leader has received acknowledgment from the majority of the nodes, it applies the log in its state machine, responds to the client, and then asks the followers to also apply the logs in their state machine.

7 // img

When a follower receives entries from the leader, it doesn't directly store them in the logs; there is a bit of logic that is triggered before accepting the entries:

8 // img

The AppendEntries RPC call includes the leader's term; it is the first check made by the follower, which first checks if its current term is less than the term. If not, it returns a ``success:false`` response to the leader.

The leader maintains a map called ``nextIndex``, where each key is a follower ID and each value represents the index of the next log entry the leader expects to send to that follower.

For every `AppendEntries` call, the leader includes two arguments: prevLogIndex and prevLogTerm. After validating the leader’s term, the follower checks its log to verify that the entry at ``prevLogIndex`` matches `prevLogTerm`.

- If there’s a mismatch, the follower replies with `success: false`, prompting the leader to decrement the index and retry with an earlier log entry.
- If they match, the follower appends the new entries to its log and responds with `success:true`.

## Snapshot and log compaction
If not taken into account, logs can grow indefinitely and cause some availability problems, so to avoid that, Raft implements snapshot, which takes a snapshot of logs at some point in time, compacts them, and stores them in stable storage. Snapshots are also used to allow slow followers or new joiners to be up to date; in that case, the leader sends the snapshot over the network to that node.

## Conclusion
There are a few details missed in this post about how Raft manages the changes to the server in a cluster, and how client interactions are handled, among others. I do hope, however, that this post has helped you build some intuition for a consensus algorithm like Raft if you were not previously familiar.

I hope you enjoy this article as much as I enjoyed writing it.

Feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/marius-vincent-niemet-928b48182/) or [Twitter](https://x.com/mariusniemet05).

