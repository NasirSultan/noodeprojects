// class Node {
//   constructor(data) {
//     this.data = data;
//     this.next = null;
//   }
// }

// class LinkedList {
//   constructor() {
//     this.head = null;
//     this.tail = null;
//     this.length = 0;
//   }

//   append(data) {
//     const node = new Node(data);
//     if (!this.head) {
//       this.head = node;
//       this.tail = node;
//     } else {
//       this.tail.next = node;
//       this.tail = node;
//     }
//     this.length++;
//   }

//   toArray() {
//     const arr = [];
//     let current = this.head;
//     while (current) {
//       arr.push(current.data);
//       current = current.next;
//     }
//     return arr;
//   }
// }

// module.exports = LinkedList;
