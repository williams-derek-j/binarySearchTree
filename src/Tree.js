import Node from "./Node"

export default class Tree {
    constructor(array) {
        array = this.sort(array)

        const midpoint = Math.round(array.length / 2) - 1
        this.root = new Node(array[midpoint])

        this.buildBranch(array.slice(0, midpoint), this.root) // build left side
        this.buildBranch(array.slice(midpoint + 1), this.root) // build right side
    }

    buildBranch(array, parent) {
        console.log('array:', array, ' length:', array.length, ' parent.value:', parent.value, ' parent:', parent)
        if (array.length === 1) {
            if (array[0] < parent.value) {
                parent.left = new Node(array[0])
            } else if (array[0] > parent.value) {
                parent.right = new Node(array[0])
            } else { // same as parent, skip
                // could return parent node up recursion chain here
            }
        } else if (array.length <= 2) {
            if (array[0] < parent.value && array[1] > parent.value) { // sorted already
                parent.left = new Node(array[0])
                parent.right = new Node(array[1])
            } else if (array[1] < parent.value && array[0] > parent.value) { // reverse sorted
                parent.left = new Node(array[1])
                parent.right = new Node(array[0])
            } else if (array[0] < array[1]) {
                if (array[0] < parent.value) { //
                    parent.left = new Node(array[0])

                    if (array[1] !== parent.value) { // check for duplicate as fail condition
                        this.buildBranch([array[1]], parent.left) // both less than parent; parent.left.left
                    } else {
                        // could return a leaf node up the recursion chain here
                    }
                } else if (array[0] > parent.value) { // both greater than parent
                    parent.right = new Node(array[0])

                    this.buildBranch([array[1]], parent.right) // parent.right.right
                } else { // element === parent, skip
                    if (array[0] !== array[1]) {  // both equal parent?
                        this.buildBranch([array[1]], parent) // skip duplicate element, append next
                    }
                }
            } else if (array[1] < array[0]) {
                if (array[1] < parent.value) {
                    parent.left = new Node(array[1])

                    if (array[0] !== parent.value) { // check for duplicate as fail condition
                        this.buildBranch([array[0]], parent.left) // both less than parent; parent.left.left
                    } else {
                        // could return a leaf node up the recursion chain here
                    }
                } else if (array[1] > parent.value) { // both greater than parent
                    parent.right = new Node(array[1])

                    this.buildBranch([array[0]], parent.right) // parent.right.right
                } else { // element === parent, skip
                    if (array[1] !== array[0]) { // both equal parent?
                        this.buildBranch([array[0]], parent) // skip duplicate element, append next
                    }
                }
            } else if (array[0] !== array[1]) { // check if both values same as fail condition
                this.buildBranch([array[0]], parent) // remove duplicate and try again
            }
        } else if (array.length >= 3) {
            const midpoint = Math.round(array.length / 2) - 1

            if (array[midpoint] < parent.value) {
                parent.left = new Node(array[midpoint])

                this.buildBranch(array.slice(0, midpoint), parent.left)
                this.buildBranch(array.slice(midpoint + 1), parent.left)
            } else if (array[midpoint] > parent.value) {
                parent.right = new Node(array[midpoint])

                this.buildBranch(array.slice(0, midpoint), parent.right)
                this.buildBranch(array.slice(midpoint + 1), parent.right)
            } else if (array[midpoint] === parent.value) {
                let noMid = [...array.slice(0, midpoint)]
                noMid += [...array.slice(midpoint + 1)]

                console.log('check if array w/ duplicate midpoint merged correctly: ', array, noMid)
                this.buildBranch(noMid, parent)
            }
        }
    }

    router(node, value) {
        if (value < node.value) {
            if (node.left) {
                return this.router(node.left, value)
            } else {
                return node
            }
            // node.left = new Node(value)
        } else if (value > node.value) {
            if (node.right) {
                return this.router(node.right, value)
            } else {
                return node
            }
            // node.right = new Node(value)
        } else {
            return node
            // return new Error("Duplicate value! Tree unchanged.")
        }
    }

    append(value) {
        const node = new Node(value)

        if (this.root) {
            const prev = this.router(this.root, value)

            if (value !== prev.value) {
                if (value < prev.value) {
                    prev.left = node
                } else {
                    prev.right = node
                }
            } else {
                return new Error("Duplicate value! Tree unchanged.")
            }
        } else {
            this.root = node
        }
    }

    remove(value) {
        if (this.root.value === value) { // removing root
            const node = this.root // root assigned to variable for readability

            if (node.left) {
                if (node.right) {
                    const mostRight = this.findMostRight(node.left)
                    mostRight.right = node.right
                }
                this.root = node.left
            } else if (this.root.right) {
                this.root = node.right
            } else {
                this.root = null
            }
        } else {
            const node = this.router(this.root, value)

            if (node.value === value) { // router might return would-be parent if value not found (as if appending)
                const parent = this.findParent(node)

                if (node === parent.left) {
                    // parent.left = null
                    if (node.left) {
                        if (node.right) {
                            const mostRight = this.findMostRight(node.left)
                            mostRight.right = node.right
                        }
                    }
                    parent.left = node.left
                    // need logic to merge left + right children of removed child node and assign to parent.left
                } else if (node === parent.right) {
                    // parent.right = null
                    if (node.left) {
                        if (node.right) {
                            const mostRight = this.findMostRight(node.left)
                            mostRight.right = node.right
                        }
                    }
                    parent.right = node.left
                    // need logic to merge left + right children of removed child and assign to parent.right
                } else {
                    console.log(node, parent.left, parent.right, parent)
                    console.log('doh')
                }
            } else {
                return new Error("Value not found! Tree unchanged.")
            }
        }
    }

    find(value, node = this.root) {
        if (value < node.value) {
            if (node.left) {
                return this.find(value, node.left)
            } else {
                return new Error('Node not found!')
            }
        } else if (value > node.value) {
            if (node.right) {
                return this.find(value, node.right)
            } else {
                return new Error('Node not found!')
            }
        } else {
            return node
        }
    }

    findParent(node, prev = this.root) {
        if (node !== prev.left && node !== prev.right) {
            if (node.value < prev.value) {
                prev = prev.left
                return this.findParent(node, prev)
            } else {
                prev = prev.right
                return this.findParent(node, prev)
            }
        } else {
            if (node === prev.left) {
                return prev
            } else if (node === prev.right) {
                return prev
            }
        }
        return new Error("Node not found!")
    }

    findMostRight(node = this.root) {
        if (node.right) {
            return this.findMostRight(node.right)
        } else {
            return node
        }
    }

    sort(arr) {
        if (arr.length === 1) {
            return arr
        } else {
            let sl = arr.length/2

            let left = this.sort(arr.slice(0, sl))
            let right = this.sort(arr.slice(sl))

            arr = []
            while (left.length > 0) {
                while (right[0] < left[0]) {
                    if (right[0] !== arr[arr.length -1]) { // check duplicates from other half
                        arr.push(right[0])
                    } else {
                        continue // skip rest of loop iteration if duplicate
                    }

                    while (right[0] === right[1]) { // remove duplicates from same half
                        right = right.slice(1)
                    }
                    right = right.slice(1)
                }
                if (left[0] !== arr[arr.length -1]) { // check duplicates from other half
                    arr.push(left[0])
                } else {
                    continue // skip rest of loop iteration if duplicate
                }

                while (left[0] === left[1]) { // remove duplicates from same half
                    left = left.slice(1)
                }
                left = left.slice(1)
            }
            if (right.length > 0) {
                arr.push(...right)
            }
            return arr
        }
    }

    prettyPrint(node, prefix = '', isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.right !== null) {
            this.prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
        if (node.left !== null) {
            this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
    }
}