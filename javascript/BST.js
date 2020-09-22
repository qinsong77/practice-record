const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1,
  EQUALS: 0
}

function defaultCompare (a, b) {
  if (a === b) {
    return Compare.EQUALS
  }
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN
}

class Node {
  constructor (key) {
    this.key = key
    this.left = null
    this.right = null
  }

  toString () {
    return `${this.key}`
  }
}

class BinarySearchTree {
  constructor (compareFn = defaultCompare) {
    this.compareFn = compareFn
    this.root = null
  }

  insert (key) {
    if (this.root === null) {
      this.root = new Node(key)
    } else {
      this.insertNode(this.root, key)
    }
  }

  insertNode (node, key) {
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      if (node.left) {
        this.insertNode(node.left, key)
      } else {
        node.left = new Node(key)
      }
    } else if (node.right) {
      this.insertNode(node.right, key)
    } else {
      node.right = new Node(key)
    }
  }

  getRoot () {
    return this.root
  }

  search (key) {
    return this.searchNode(this.root, key)
  }

  searchNode (node, key) {
    if (node == null) {
      return false
    }
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      return this.searchNode(node.left, key)
    }
    if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      return this.searchNode(node.right, key)
    }
    return true
  }

  inOrderTraverse (callback) {
    this.inOrderTraverseNode(this.root, callback)
  }

  inOrderTraverseNode (node, callback) {
    if (node) {
      this.inOrderTraverseNode(node.left, callback)
      callback(node.key)
      this.inOrderTraverseNode(node.right, callback)
    }
  }

  preOrderTraverse (callback) {
    this.preOrderTraverseNode(this.root, callback)
  }

  preOrderTraverseNode (node, callback) {
    if (node) {
      callback(node.key)
      this.preOrderTraverseNode(node.left, callback)
      this.preOrderTraverseNode(node.right, callback)
    }
  }

  postOrderTraverse (callback) {
    this.postOrderTraverseNode(this.root, callback)
  }

  postOrderTraverseNode (node, callback) {
    if (node) {
      this.postOrderTraverseNode(node.left, callback)
      this.postOrderTraverseNode(node.right, callback)
      callback(node.key)
    }
  }

  min () {
    return this.minNode(this.root)
  }

  minNode (node) {
    let current = node
    while (current && current.left) {
      current = current.left
    }
    return current
  }

  max () {
    return this.maxNode(this.root)
  }

  maxNode (node) {
    let current = node
    while (current && current.right) {
      current = current.right
    }
    return current
  }

  remove (key) {
    this.root = this.removeNode(this.root, key)
  }

  removeNode (node, key) {
    if (node == null) {
      return undefined
    }
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.left = this.removeNode(node.left, key)
      return node
    }
    if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.right = this.removeNode(node.right, key)
      return node
    }
    // key is equal to node.item
    // handle 3 special conditions
    // 1 - a leaf node
    // 2 - a node with only 1 child
    // 3 - a node with 2 children
    // case 1
    if (node.left === null && node.right === null) {
      node = undefined
      return node
    }
    // case 2
    if (node.left == null) {
      node = node.right
      return node
    }
    if (node.right == null) {
      node = node.left
      return node
    }
    // case 3
    const aux = this.minNode(node.right)
    node.key = aux.key
    node.right = this.removeNode(node.right, aux.key)
    return node
  }
}

const BalanceFactor = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BALANCED: 3,
  SLIGHTLY_UNBALANCED_LEFT: 4,
  UNBALANCED_LEFT: 5
}

class AVLTree extends BinarySearchTree {
  constructor (compareFn = defaultCompare) {
    super(compareFn)
    this.compareFn = compareFn
    this.root = null
  }

  getNodeHeight (node) {
    if (node == null) {
      return -1
    }
    return Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) + 1
  }

  /**
   * Left left case: rotate right
   *
   *       50                           30
   *      / \                          / \
   *     30   70 -> rotationLL(b) -> 10  50
   *    / \                         /   / \
   *   10   40                     5    40  70
   *  /
   * 5
   * @param node Node<T>
   */
  rotationLL (node) {
    const tmp = node.left
    node.left = tmp.right
    tmp.right = node
    return tmp
  }

  /**
   * Right right case: rotate left
   *
   *     a                              b
   *    / \                            / \
   *   c   b   -> rotationRR(a) ->    a   e
   *      / \                        / \
   *     d   e                      c   d
   *
   * @param node Node<T>
   */
  rotationRR (node) {
    const tmp = node.right
    node.right = tmp.left
    tmp.left = node
    return tmp
  }

  /**
   * Left right case: rotate left then right
   * @param node Node<T>
   */
  rotationLR (node) {
    node.left = this.rotationRR(node.left)
    return this.rotationLL(node)
  }

  /**
   * Right left case: rotate right then left
   * @param node Node<T>
   */
  rotationRL (node) {
    node.right = this.rotationLL(node.right)
    return this.rotationRR(node)
  }

  getBalanceFactor (node) {
    const heightDifference = this.getNodeHeight(node.left) - this.getNodeHeight(node.right)
    switch (heightDifference) {
      case -2:
        return BalanceFactor.UNBALANCED_RIGHT
      case -1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
      case 1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
      case 2:
        return BalanceFactor.UNBALANCED_LEFT
      default:
        return BalanceFactor.BALANCED
    }
  }

  insert (key) {
    this.root = this.insertNode(this.root, key)
  }

  insertNode (node, key) {
    if (node === null) {
      return new Node(key)
    } if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.left = this.insertNode(node.left, key)
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.right = this.insertNode(node.right, key)
    } else {
      return node // duplicated key
    }
    // verify if tree is balanced
    const balanceFactor = this.getBalanceFactor(node)
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
      if (this.compareFn(key, node.left.key) === Compare.LESS_THAN) {
        // Left left case
        node = this.rotationLL(node)
      } else {
        // Left right case
        return this.rotationLR(node)
      }
    }
    if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
      if (this.compareFn(key, node.right.key) === Compare.BIGGER_THAN) {
        // Right right case
        node = this.rotationRR(node)
      } else {
        // Right left case
        return this.rotationRL(node)
      }
    }
    return node
  }

  removeNode (node, key) {
    node = super.removeNode(node, key) // {1}
    if (node == null) {
      return node
    }
    // verify if tree is balanced
    const balanceFactor = this.getBalanceFactor(node)
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
      // Left left case
      if (
        this.getBalanceFactor(node.left) === BalanceFactor.BALANCED ||
        this.getBalanceFactor(node.left) === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
      ) {
        return this.rotationLL(node)
      }
      // Left right case
      if (this.getBalanceFactor(node.left) === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
        return this.rotationLR(node.left)
      }
    }
    if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
      // Right right case
      if (
        this.getBalanceFactor(node.right) === BalanceFactor.BALANCED ||
        this.getBalanceFactor(node.right) === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
      ) {
        return this.rotationRR(node)
      }
      // Right left case
      if (this.getBalanceFactor(node.right) === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) {
        return this.rotationRL(node.right)
      }
    }
    return node
  }
}

const avl = new AVLTree()
avl.insert(1)
avl.insert(2)
avl.insert(3)
avl.insert(13)
avl.insert(23)

console.log(avl.getRoot())
