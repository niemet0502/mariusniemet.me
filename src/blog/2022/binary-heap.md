---
title: Binary Heap
date: "2022-10-12"
description: "A binary Heap is a binary tree like data structure that is always a complete binary tree. A complete binary tree is a binary tree in which all the levels are completely filled except possibly the lowest one, which is filled from the left. There are two types of binary heap: max heap and min heap."
published: true
author: "marius niemet"
slug: binary-heap
categorie: dsa
---

A binary Heap is a binary tree like data structure that is always a complete binary tree. A complete binary tree is a binary tree in which all the levels are completely filled except possibly the lowest one, which is filled from the left. There are two types of binary heap: max heap and min heap.

## Max Heap

A Max heap is a binary heap in which the parent’s value is always greater than the value of its children.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/srxrd33x4htmvr6txiv2.png)

## Min Heap

A Max heap is a binary heap in which the parent’s value is always less than the value of its children.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/e9mnhvwkm9ju41x9rzyg.png)

## Representation

Since a binary tree is always a complete binary tree, it can be also represented by using an array.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/swd82eh9csf2inxszknh.png)

The traversal that is used to build the array is Level order traversal. When a binary heap is represented by using an array you can find the parent, right or left child by using the following:

- Array[0]: root node
- Array[(i*2)+1]: the left child of the node that’s at the position i
- Array[(i*2)+2]: the right child of the node that’s at the position i
- Array[(i-1)/2]: the parent of the node that’s at the position i

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/80v8e91g77d5silwu1sk.png)

Let’s see how to create a binary Heap.

## Add new value

While you are trying to add a new value to a binary heap, this new value should be added at the end of the binary heap to keep it as a complete binary tree. Once the value is added, you have to compare it with its parent, if you are created a max heap you have to check if the new value is greater than its parent, if so you have to swap them, and continue with this process until the value is at the right place (greater than its children). In case it's a min heap you have if the new value is less than its parent, if so you follow the same process as a max heap (swap child and parent). The illustration below will help to visualize:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7e4k9l8qcwsuyd1sak79.png)

### Javascript implementation

```javascript
function add(val){
  //add at the end of the array
  this.arr.push(val)

  let i = this.arr.length - 1;

  while(this.arr[i] >  this.arr[Math.round((i-1)/2)]){

    if(this.arr[i] >  this.arr[Math.round((i-1)/2)]){
      let temp = this.arr[i];
      this.arr[i] = this.arr[Math.round((i-1)/2)];
      this.arr[Math.round((i-1)/2)] = temp;

     i = Math.round((i-1)/2);
   }
  }

```

### Explanation

First of all we had the new value at the end of the array by using the javascript method push and then we save the new value position since the value is at the end its position is the array length minus 1. While the new value is greater than its parent we will adjust the tree. Inside of the loop, we check if the value is greater than its parent, if so we swap them and save its new position. Since the value has changed a position we need to compare it again with its new parent to be sure it has the right position. The number of swaps depends on the Tree length and the Tree length is equal to **O(log n)** so the time complexity to add a new value into a binary Heap is **O(log n)**.

## Deletion

While trying to delete a node from a binary heap, you can only delete the root element, when it’s a max heap, you retrieve the first largest value and when it’s a min heap, you retrieve the first smallest value. Once the node is deleted, you have to push the last node of the binary heap to the root position, to keep the tree complete. Then you can start to adjust the tree, first, you have to compare the root’s children, once you have to greater of them, you can compare it with the parent, if it is greater than the parent you have to swap their positions, continue this process until the node it at the right position (greater than its children). The illustration below will help to visualize:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v4dvwt01jatkoxjm7spr.png)

### Javascript implementation

```javascript
// if its a max binary heap we retrieve the  largest element
// if its a min binary heap we retrieve the smallest element
function delete(){
  let result = this.arr[0]; // retrieve a the first element
  this.arr[0] = this.arr.pop(); // push the last element at the first place to keep the binary heap full

  // adjust the binary tree by comparing each parent with its children

  i = 0;
  while(!(this.arr[i] > this.arr[2*i+1] && this.arr[i] > this.arr[2*i+2])){

  if(this.arr[2*i+1] > this.arr[2*i+2]){
    if(this.arr[i] < this.arr[2*i+1]){
      let temp = this.arr[i];
      this.arr[i] = this.arr[2*i+1];
      this.arr[2*i+1] = temp;

      i = 2*i+1;
    }
    }else{
       if (this.arr[i] < this.arr[2*i+2]){
        let temp = this.arr[i];
        this.arr[i] = this.arr[2*i+2];
        this.arr[2*i+2] = temp;

        i = 2*i+2;
      }
    }
  }

  return result;
}
```

### Explanation

First of all we save the first element and push the last element at its position and we save the position 0 into a variable. Now we have to adjust the binary Heap, so to adjust after a deletion we need to check if the root element is at the right place, and to check that, you need to first compare it to its children, to know which is greater and then compare the greater child with the parent, if the child is greater we have to swap them, and so on the process continue until the root element is greater than its children. Time complexity is **O(Log n)** because the number of swaps depends on the tree length.

### Create a new Binary Heap

Most time we will create a heap from another data structure, now we gonna see how to make a max heap from an array.

```javascript
function createMaxHeapFromArray(arr) {
  let binaryHeap = [];

  for (let j = 0; j < arr.length; j++) {
    binaryHeap.push(arr[j]);
    let i = binaryHeap.length - 1;

    while (binaryHeap[i] > binaryHeap[Math.round((i - 1) / 2)]) {
      if (binaryHeap[i] > binaryHeap[Math.round((i - 1) / 2)]) {
        let temp = binaryHeap[i];
        binaryHeap[i] = binaryHeap[Math.round((i - 1) / 2)];
        binaryHeap[Math.round((i - 1) / 2)] = temp;

        i = Math.round((i - 1) / 2);
      }
    }
  }

  return binaryHeap;
}
```

The code above shows you how to create a max heap from an array, basically, you have to create a new array called maxHeap, traverse the entire array, and at each lap add the current value into the max heap by following to code we have written in the first part of the article. The time complexity of this is **O(nlogn)** since insertion into a heap takes O(logn) and we do that for all the array’s values (n). The space complexity is **O(n)**.

Well, now we know what a binary heap, the types of binary heap, how to add, delete and even create a binary heap from a given array but we don’t know in which case a binary heap can be useful during an interview. A binary heap is useful when you face questions like [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) or [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-largest-element-in-an-array/) because you can create a max heap or min heap from the given data structure and then retrieve the first kth element of your binary heap.

## Conclusion

Well, we have learned a lot of things in this one, I hope you enjoy reading this as much as I enjoyed the writing process.
