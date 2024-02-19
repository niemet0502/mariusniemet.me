---
title: Linked list
date: "2022-03-21"
description: "A linked list is a linear data structure, in which the elements are not stored at contiguous memory locations.."
published: false
author: "marius niemet"
slug: linked-list
categorie: dsa
---

A linked list is a linear data structure, in which the elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers as shown in the below image:

### An advantage of a linked list

A node can easily be removed or added from a linked list without reorganizing the entire data structure. This is one advantage it has over arrays.

### Disadvantages of a linked list

- Search operations are slow in linked lists. Unlike arrays, random access of elements is not allowed. Nodes are accessed sequentially by starting from the first node.
- It uses more memory than an array because of the reference storage.

## Linked List Terminologies

### Head

The Head is the entry point into a linked list. It should be noted that head isn’t a separate note but a reference to the first node. If the list is empty then the head is a null reference.

### Node

Each element of a linked list is called a Node. A node contains a value that is of any type and a reference to the next node. If it’s the last node of the list, her reference is null.

### Linked list in Javascript

In javascript, the pointer concept is implicit, and therefore, you will have an object and the next part will contain the next node, something like the code below.

```javascript
const list = {
    head: {
        value: 6
        next: {
            value: 10
            next: {
                value: 12
                next: {
                    value: 3
                    next: null
                    }
                }
            }
        }
    }
```

## Types of Linked List

### Singly linked list

Each node contains only one reference to the next node. This is what we have been talking about so far.

### Doubly linked list

Each node contains two references, a reference to the next node and a reference to the previous node.

### Circular linked list

Circular linked lists are a variation of a linked list in which the last node points to the first node or any other node before it, thereby forming a loop.

## Operations

In the next part of this article, we will see how to do the following operations with a singly linked list in JavaScript:

- Create a new linked list
- Add a new node
- Add a new node at a position
- get the last element
- get the first element
- clear
- size
- Delete an element

### Create a new linked list

As stated earlier, a list node contains two items: the data and the pointer to the next node. We can implement a list node in JavaScript as follows:

```javascript
class ListNode {
  constructor(data) {
    this.value = value;
    this.next = null;
  }
}
```

The code below shows the implementation of a linked list class with a constructor. Notice that if the head node is not passed, the head is initialized to null.

```javascript
class LinkedList {
  constructor(head = null) {
    this.head = head;
  }
}
```

### Add a new node

```javascript
addElement(element){
  let node = new Node(element);
  let current = this.head;

  if(current == null){
    this.head = node;
  }else{
    while(current.next) {
      current = current.next;
    }
    current.next = node;
 }
}
```

The code above shows how to add a new element at the end of the list. This method receives a parameter this parameter is the value that will be stored in the new node. Firstly we create a new node with the parameter as value and we save the head value in a variable called current. If current is equal to null that means this new element is the first node of our list else we browse the whole list and put the new node as the next reference of our last element.

**Time complexity**

- when the new node is the first, your time complexity is O(1).
- when you are inserting the new node at the last, the time complexity is O(N). N represents the number of nodes.

**Illustration**
**Note**
Before each traversal of your list you should save the head value in another variable else you will lose the head value and if you lose the head that means you can access your list anymore.

### Add a new node at a position

```javascript
addElementAtPosition(element,pos){
  let node = new Node(element); // create the new node
  let current = this.head; // save the head reference

  let i = 0; // create increment variable to count the number for nodes

  while (i < pos) {
    i++;
    prev = current;
    current = current.next;
  }

  node.next = current;
  prev.next = node;
 }
```

Our addElementAtPosition function receives two params, firstly the new element and secondly the position where the node will be added. We start by declaring an increment, Its role will be to increment at each browse of the list and our browse will stop when the current position will be equal to the parameter position. For each tour in the loop, we save the current in a variable called prev because this element will be previous to the new node and will contain the reference toward him.
At the end of the loop, the next value in the new node receives current node and the prev receives the new node that we are adding.

**Time complexity: O(n)**

### Size()

```javascript

size() {
    let count = 0;
    let current = this.head;
    while (current.next) {
        count++;
        node = node.next
    }
    return count;
}
```

This method returns the number of nodes present in the linked list by counting for each tour in the loop.

### Clear()

```javascript
clear() {
    this.head = null;
}
```

This method clears the linked list by reinitializing the head at null.

### Get the last element

```javascript
getLast() {
    let las = this.head;
    if (last) {
        while (lastNode.next) {
            last = last.next
        }
    }
    return last;
}
```

The code above returns the last element of the list. Firstly we save the head value in a variable called last. if last is equal to null that means the list is empty if the list isn’t empty we browse the entire list and return the last element.

### Get the first Element

```javascript
getFirst() {
    return this.head;
}
```

This method returns the first element by returning the head value because the head will always have to refer to the first element.

### Delete an element

```javascript
removeElement(element){
  let current = this.head;
  let prev = null;

  while(current.next){
    if(current.value === element){
      if(prev === null){
        this.head = current.next;
      }else{
        prev.next = current.next;
      }
      return current.value;
    }
  prev = current;
  current = current.next;
}
```

The code above explains how to delete an item in a linked list. First, we go through the list, and for each node, we check if its value is the one we want to delete, if so then we check if the current node is the first of our list, if so we make the head reference the node after the current therefore the actual will be not linked to the head anymore. In the second case, the current node isn’t the first therefore we make the previous node references the node after the actual node.
**Illustration**

In this article, we discussed what a linked list is and how it can be implemented in JavaScript. We also discussed the different types of linked lists, as well as their overall advantages and disadvantages, hope that you learn something new by reading this article. See you in the next post of this series we will discuss about doubly and circular linked lists.
