---
title: Binary Search
date: "2022-08-23"
description: "Binary Search is a search algorithm used in a sorted array. It can be implemented in two ways which are iterative or recursive methods."
published: true
author: "marius niemet"
slug: binary-search
categorie: dsa
---

Binary Search is a search algorithm used in a sorted array. It can be implemented in two ways which are iterative or recursive methods.

### Javascript iterative method

```javascript
function binarySearchIterative(arr, x, l, h) {
  while (l <= h) {
    mid = Math.floor((l + h) / 2);

    if (arr[mid] === x) {
      return mid;
    } else {
      if (arr[mid] > x) {
        h = mid - 1;
      } else {
        l = mid + 1;
      }
    }
  }

  return -1;
}
```

### Javascript recursive method

```javascript
function binarySearchRecursive(arr, x, l, h) {
  if (l <= h) {
    mid = Math.floor((l + h) / 2);

    if (arr[mid] === x) {
      return mid;
    } else {
      if (arr[mid] > x) {
        return binarySearchRecursive(arr, x, l, mid - 1);
      } else {
        return binarySearchRecursive(arr, x, mid + 1, h);
      }
    }
  }

  return -1;
}
```

### Explanation

The binarySearch function receives four parameters: the array, the value we are looking for `x`, and the array's first `low` and last position `high`.

We will traverse the array while `low` is less or equal to `high` because they are supposed to be at the two extremities, if `low` is greater than `high` we assume that we have already traversed the part of the array that is interesting and if we don’t find the value we return -1.

To avoid traversing the entire array since it is already sorted, the binary search algorithm calculates the middle of the array and checks if the value that is in the middle is equal to `x`, if so we return the position. if it isn’t we check which part of the array is worth looking at by calculating if the value in the middle is greater or less than `x`.

if the middle value is greater than `x`, the case before it becomes the new `high`, and if it is less than `x` the case just after it becomes the new `low`. That means the interval will be reduced until we find `x`. If `x` isn’t in the array we return -1 because at one moment `low` will be greater than `high` and the traversal will be stopped.

### Illustration

The value we are looking for is 4.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5smi79xz6lz8kx8eou0n.png)

Firstly we calculate the middle of the array which is 3. array[3] is 6 which is less than 4 the value we are looking for, so we reduce the interval the case before 3 becomes the new high.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/htnvxeux7a6fdcsxg75p.png)

In the second pass in the loop, we calculate again the middle which is equal to 2. array[2] is to 4, which means we found our x and then return 2.

### Complexity analysis

Since we will never traverse the entire array, the binary search algorithm has a time complexity of **O(log n)** and because we don’t use any extra space the space complexity is **O(1)**.

### Conclusion

We are at the end of our post, we can summarize that binary search is an algorithm that can help to find a value in a sorted array with a time complexity of O(log n), I hope that you learn something new by reading this article.
