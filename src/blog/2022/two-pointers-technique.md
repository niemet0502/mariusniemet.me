---
title: Two Pointers Technique
date: "2022-10-12"
description: "The Two Pointers Technique is a technique that allows you to optimize your runtime (time complexity and often space complexity) By utilizing some ordering data. It’s generally applied on arrays and linked lists."
published: true
author: "marius niemet"
slug: two-pointers-technique
categorie: dsa
---

The Two Pointers Technique is a technique that allows you to optimize your runtime (time complexity and often space complexity) By utilizing some ordering data. It’s generally applied on arrays and linked lists.

The approach has 3 steps:

- **Initialization:** Starting points. Pointers can be at any place depending upon what we are trying to achieve.
- **Movement**: This will decide how we converge towards the solution. Pointer can move in the same direction or in the opposite direction.
- **Stop condition:** This decides when we stop.

### Palindrome

You’re given a string as input, return true if this string is a palindrome otherwise false. A palindrome is a word, number, phrase, or other sequences of characters that reads the same backward as forward.

```
var isPalindrome = function(str) {
    let i = 0;
    let j = str.length -1;

    while(i<j){
        if(str[i] !== str[j]){
            return false;
        }

        i++;
        j--;
    }

    return true;
};
```

To solve this problem, we use the two-pointers technique. Let’s see the 3 steps.

- **Initialization:** at lines 2 and 3 we define where our two pointers will start the traversal, I at the beginning and j at the end.
- **Movement:** In lines 10 and 11, our two pointers will move in an opposite direction, the first one towards the front and the second one in the opposite direction.
- **Stop condition:** the traversal will stop when i>j because since I start at the beginning and j at the end while i is incrementing and j decrementing, at the middle of the array i will be greater than j and we assume that all the elements will have been traveled.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qyksndurdcg8c2qjmgmz.png)

### Is pair sum:

Given a sorted array A (sorted in ascending order), having N integers, find if there exists any pair of elements (A[i], A[j]) such that their sum is equal to X.

**Naive approach:**

This approach consists of using two nested loops. the first loop will start from the first element of the array to the second last. The second loop will start at i+1 until the end of the array. Inside the second loop, we will calculate the sum of the current elements, if their sum is equal to the value we are searching we return true otherwise we stop the second loop.

```
function isPairSum(nums, X) {
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {

      if (nums[i] + nums[j] == X) return true;

      if (nums[i] + nums[j] > X) break;
    }
  }

  return false;
}
```

The Time complexity of this solution is **O(N²)** because of the two nested loops.

**Two pointers approach:**

```
function isPairSum2(nums, X) {
  // first pointer
  let i = 0;

  // second pointer
  let j = nums.length - 1;
  while (i < j) {

    if (nums[i] + nums[j] == X) return true;

    else if (nums[i] + nums[j] < X) i++;

    else j--;
  }
  return false;
}
```

For this second solution we use the two-pointer technique, let's see how we apply its 3 steps:

- **Initialization:** at lines 3 and 6, we have the initialization, the first pointer will start at the beginning of the list and the second one at the end.
- **Movement:** they will move in the opposite direction according to lines 11 and 13 if their sum is less than the value, the first pointer will move forward if their sum is greater than the value we are looking for the second pointer will move backward.
- **Stop condition:** the traversal will stop when the first pointer will ahead of the second.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gzb7uj9owfbf2off4m8v.png)

The time complexity is **O(n)** because we traverse the array only once. For this problem, the two-pointer helps us to reduce our time complexity we have a linear complexity instead of a square.

Let’s see another problem, this time on a linked list.

### Middle of the Linked List

Given the head of a singly linked list, return the middle node of the linked list.

**Naive approach:**

Put every node into an array A in order. Then the middle node is just A[A.length // 2]since we can retrieve each node by index.

```
var middleNode = function(head) {
    let A = [head];
    while (A[A.length - 1].next != null)
        A.push(A[A.length - 1].next);
    return A[Math.trunc(A.length / 2)];
};
```

The Time complexity of this approach is **O(N)** and his space complexity is also **O(N)** because we create an array with all the nodes in the list.

**Two pointers approach:**

When traversing the list with a pointer slow, make another pointer fast that traverses twice as fast. When fast reaches the end of the list, slow must be in the middle.

```
var middleNode = function(head) {

    let slow = head;
    let fast = head;

    while( fast && fast.next){
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
};
```

- **Initialization:** The two pointers will start at the same position, the beginning of the linked list.

- **Movement:**they will move in the same direction but, the second faster than the first.

- **Stop condition:** the traversal will stop when the pointer that moves faster will reach the end of the linked list. Since the faster pointer moves twice faster than the slow pointer, when it reaches the end, the slow will be in the middle.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yqjnwqho0nrvj9ve6egj.png)

The Time complexity of this solution is **O(N)** but the space complexity is only **O(1)**, we use any extra space because of the two-pointers approach. For this problem, the two-pointer helps us to reduce our space complexity we have a constant complexity instead of a linear.

### Conclusion

The two-pointers technique helps you to reduce your algorithm’s runtime. You can use it with an array and linked list. The pointers don’t necessarily start at the same position or move in the same direction, the stop condition is defined by what you’re looking for.

Hope this helped and encourages you to try out this technique if not done already.

The Nothing 🔺
