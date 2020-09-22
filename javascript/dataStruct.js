// 循环列表
/**
 * Initialize your data structure here. Set the size of the queue to be k.
 * @param {number} k
 */
var MyCircularQueue = function(k) {
  this.length = k
  this.fPos = -1
  this.ePos = -1
  this.queue = []
  this.queue.length = k
};

/**
 * Insert an element into the circular queue. Return true if the operation is successful.
 * @param {number} value
 * @return {boolean}
 */
MyCircularQueue.prototype.enQueue = function(value) {
  if (this.isFull()) return false
  if (this.isEmpty()) {
    this.fPos ++
    this.ePos ++
    this.queue[this.ePos] = value
  } else if (this.ePos === this.length-1) {
    this.queue[0] = value
    this.ePos = 0
  } else {
    this.ePos ++
    this.queue[this.ePos] = value
  }
  return true
};

/**
 * Delete an element from the circular queue. Return true if the operation is successful.
 * @return {boolean}
 */
MyCircularQueue.prototype.deQueue = function() {
  if (this.isEmpty()) return false
  this.queue[this.fPos] = undefined
  if (this.fPos === this.ePos) {
    this.fPos = this.ePos = -1
  } else if (this.fPos < this.length) this.fPos ++
  else this.fPos = 0
  return true
};

/**
 * Get the front item from the queue.
 * @return {number}
 */
MyCircularQueue.prototype.Front = function() {
  if (this.isEmpty()) return -1
  else return this.queue[this.fPos]
};

/**
 * Get the last item from the queue.
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function() {
  if (this.isEmpty()) return  -1
  else return this.queue[this.ePos]
};

/**
 * Checks whether the circular queue is empty or not.
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function() {
  return this.fPos === this.ePos && this.fPos === -1
};

/**
 * Checks whether the circular queue is full or not.
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function() {
  if (this.ePos + 1 === this.length) return this.queue[0] !== undefined
  return this.queue[this.ePos+1] !== undefined
};

var obj = new MyCircularQueue(6)
console.log(null)
console.log(obj.enQueue(6))
console.log(obj.Rear())
console.log(obj.Rear())
console.log(obj.deQueue())
console.log(obj.enQueue(5))
console.log(obj.Rear())
console.log(obj)
console.log(obj.deQueue())
console.log(obj)
console.log(obj.Front())
// console.log(obj)
/**
 * Your MyCircularQueue object will be instantiated and called as such:
 * var obj = new MyCircularQueue(k)
 * var param_1 = obj.enQueue(value)
 * var param_2 = obj.deQueue()
 * var param_3 = obj.Front()
 * var param_4 = obj.Rear()
 * var param_5 = obj.isEmpty()
 * var param_6 = obj.isFull()
 */


// 十进制转base进制
function baseConverter(decNumber, base = 2) {
  let rem = null, baseStr = ''
  const digits = '0123456789ABCDEF'
  while (decNumber > 0) {
    rem = Math.floor(decNumber%base)
    baseStr += digits[rem]
    decNumber = Math.floor(decNumber/base)
  }
  baseStr = baseStr.split('').reverse().join('')
  return baseStr
}

console.log(baseConverter(32, 16))
console.log(baseConverter(10) === (10).toString(2))
console.log(baseConverter(32, 16) === (32).toString(16))

/*栈*/
class Stack {
  constructor() {
    this.items = []
  }

  push(element) {
    this.items.push(element)
  }

  pop() {
    return this.items.pop()
  }

  peek() { // 返回栈顶的元素，不对栈做任何修改（该方法不会移除栈顶的元素， 仅仅返回它）。
    return this.items[this.items.length - 1]
  }

  isEmpty() {
    return this.items.length === 0
  }

  clear() {
    this.items = []
  }

  size() {
    return this.items.length
  }
}

function baseConverter(decNumber, base) {
  const remStack = new Stack()
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let number = decNumber
  let rem
  let baseString = ''
  if (!(base >= 2 && base <= 36)) {
    return ''
  }
  while (number > 0) {
    rem = Math.floor(number % base)
    remStack.push(rem)
    number = Math.floor(number / base)
  }
  while (!remStack.isEmpty()) {
    console.log(remStack.items)
    baseString += digits[remStack.pop()]
  }
  return baseString
}

console.log(baseConverter(100345, 2) === '11000011111111001')

class Queue {
  constructor() {
    this.count = 0
    this.lowestCount = 0
    this.items = {}
  }

  enqueue(element) {
    this.items[this.count] = element
    this.count++
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined
    }
    const result = this.items[this.lowestCount]
    delete this.items[this.lowestCount]
    this.lowestCount++
    return result
  }

  peek() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.lowestCount]
  }

  isEmpty() {
    return this.count - this.lowestCount === 0
  }

  size() {
    return this.count - this.lowestCount
  }

  clear() {
    this.items = []
    this.count = this.lowestCount = 0
  }

  toString() {
    if (this.isEmpty()) {
      return ''
    }
    let objString = `${this.items[this.lowestCount]}`
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`
    }
    return objString
  }
}

/*双端队列*/
class Deque {
  constructor() {
    this.count = 0
    this.lowestCount = 0
    this.items = {}
  }

  addFront(element) {
    if (this.isEmpty()) {
      this.addBack(element)
    } else if (this.lowestCount > 0) {
      this.lowestCount--
      this.items[this.lowestCount] = element
    } else {
      for (let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i - 1]
      }
      this.count++
      this.lowestCount = 0
      this.items[0] = element // {4}
    }
  }

  addBack(element) {
    this.items[this.count] = element
    this.count++
  }

  removeFront() {
    if (this.isEmpty()) {
      return undefined
    }
    const result = this.items[this.lowestCount]
    delete this.items[this.lowestCount]
    this.lowestCount++
    return result
  }

  removeBack() {
    if (this.isEmpty()) {
      return undefined
    }
    this.count--
    const result = this.items[this.count]
    delete this.items[this.count]
    return result
  }

  peekFront() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.lowestCount]
  }

  peekBack() {
    if (this.isEmpty()) {
      return undefined
    }
    return this.items[this.count - 1]
  }

  isEmpty() {
    return this.count - this.lowestCount === 0
  }

  size() {
    return this.count - this.lowestCount
  }

  clear() {
    this.items = []
    this.count = this.lowestCount = 0
  }

  toString() {
    if (this.isEmpty()) {
      return ''
    }
    let objString = `${this.items[this.lowestCount]}`
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`
    }
    return objString
  }
}


function hotPotato(elementsList, num) {
  const queue = new Queue()
  const elimitatedList = []
  for (let i = 0; i < elementsList.length; i++) {
    queue.enqueue(elementsList[i])
  }
  while (queue.size() > 1) {
    for (let i = 0; i < num; i++) {
      queue.enqueue(queue.dequeue())
    }
    elimitatedList.push(queue.dequeue())
  }
  return {
    eliminated: elimitatedList,
    winner: queue.dequeue() // {5}
  }
}

const names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl']
const result = hotPotato(names, 7)
result.eliminated.forEach(name => {
  console.log(`${name}在击鼓传花游戏中被淘汰。 `)
})
console.log(`胜利者： ${result.winner}`)


function palindromeChecker(aString) {
  if (aString === undefined || aString === null ||
    (aString !== null && aString.length === 0)) {
    return false
  }
  const deque = new Deque()
  const lowerString = aString.toLocaleLowerCase().split(' ').join('')
  let isEqual = true
  let firstChar, lastChar
  for (let i = 0; i < lowerString.length; i++) {
    deque.addBack(lowerString.charAt(i))
  }
  while (deque.size() > 1 && isEqual) {
    firstChar = deque.removeFront()
    lastChar = deque.removeBack()
    if (firstChar !== lastChar) {
      isEqual = false // {8}
    }
  }
  return isEqual
}

console.log('a', palindromeChecker('a'))
console.log('aa', palindromeChecker('aa'))
console.log('kayak', palindromeChecker('kayak'))
console.log('level', palindromeChecker('level'))
console.log('Was it a car or a cat I saw', palindromeChecker('Was it a car or a cat I saw'))
console.log('Step on no pets', palindromeChecker('Step on no pets'))



// 链表

function defaultEquals (a, b) {
  return a === b
}

class Node {
  constructor (element) {
    this.element = element
    this.next = null
  }
}

class LinkedList {
  constructor (equalsFn = defaultEquals) {
    this.count = 0
    this.head = null
    this.equalsFn = equalsFn
  }

  push (element) {
    const node = new Node (element)
    if (this.head) {
      let current = this.head
      while (current.next !== null) {
        current = current.next
      }
      current.next = node
    } else {
      this.head = node
    }
    this.count++
  }

  getElementAt (index) {
    if (index >= 0 && index <= this.count) {
      let node = this.head
      for (let i = 0; i < index && node != null; i++) {
        node = node.next
      }
      return node
    }
    return undefined
  }

  insert (element, index) {
    if (index >= 0 && index <= this.count) {
      const node = new Node (element)
      if (index === 0) {
        node.next = this.head
        this.head = node
      } else {
        const previous = this.getElementAt (index - 1)
        node.next = previous.next
        previous.next = node
      }
      this.count++
      return true
    }
    return false
  }

  removeAt (index) {
    if (index >= 0 && index < this.count) {
      let current = this.head
      if (index === 0) {
        this.head = current.next
      } else {
        const previous = this.getElementAt (index - 1)
        current = previous.next
        previous.next = current.next
      }
      this.count--
      return current.element
    }
    return undefined
  }

  remove (element) {
    const index = this.indexOf (element)
    return this.removeAt (index)
  }

  indexOf (element) {
    let current = this.head
    for (let i = 0; i < this.size () && current != null; i++) {
      if (this.equalsFn (element, current.element)) {
        return i
      }
      current = current.next
    }
    return -1
  }

  isEmpty () {
    return this.size () === 0
  }

  size () {
    return this.count
  }

  getHead () {
    return this.head
  }

  clear () {
    this.head = undefined
    this.count = 0
  }

  toString () {
    if (this.head == null) {
      return ''
    }
    let objString = `${this.head.element}`
    let current = this.head.next
    for (let i = 1; i < this.size () && current != null; i++) {
      objString = `${objString},${current.element}`
      current = current.next
    }
    return objString
  }
}
