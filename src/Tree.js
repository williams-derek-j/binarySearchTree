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
        // console.log('array:', array, ' length:', array.length, ' parent.value:', parent.value, ' parent:', parent)
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

    router(value, node = this.root) { // returns parent with empty child closest to value
        if (value < node.value) {
            if (node.left) { // at end of tree?
                return this.router(value, node.left) // not yet, recurse
            } else {
                return node // yes, return parent
            }
        } else if (value > node.value) {
            if (node.right) { // at end of tree?
                return this.router(value, node.right) // not yet, recurse
            } else {
                return node // yes, return parent
            }
        } else if (value === node.value) { // node with value already exists?
            return null // return null -- there's a function to find nodes so just use that if that's what you're trying to do
        } else if (!node.value) {
            return new Error('Node.value is undefined!')
        }
    }

    append(value) {
        const node = new Node(value)

        if (this.root) {
            const prev = this.router(value)
            console.log(prev)

            if (prev !== null) {
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

    routerInsert(value, node = this.root) { // returns parent whose occupied child slots are first place inserted value fits, rather than first empty child
        if (value < node.value) {
            if (node.left) {
                if (value > node.left.value) { // found appropriate occupied child slot
                    return node // returns parent of occupied child slot
                } else if (value < node.left.value) {
                    return this.routerInsert(value, node.left)
                } else { // duplicate found at lowest possible depth, return null
                    return null
                }
            } else { // found empty child slot
                return node // returns parent of empty child slot
            }
        } else if (value > node.value) {
            if (node.right) {
                if (value < node.right.value) { // found appropriate occupied child slot
                    return node // returns parent of occupied child slot
                } else if (value > node.right.value) {
                    return this.routerInsert(value, node.right)
                } else {
                    return null // duplicate found at lowest possible depth, return null
                }
            } else { // found empty child slot
                return node // returns parent of empty child slot
            }
        }
    }

    insert(value) {
        const found = this.find(value, true) // could search starting from return value of routerInsert

        const node = new Node(value)
        const parent = this.routerInsert(value)
        let side

        if (parent !== null) { // routerInsert() returns null if value already exists at lowest depth
            if (node.value < parent.value) { // inserted node will be left child of parent
                side = 'left' // left
                node.left = parent.left
                parent.left = node
            } else if (node.value > parent.value) { // inserted node will be right child of parent
                side = 'right' // right
                node.right = parent.right
                parent.right = node
            }
        } else {
            console.log(new Error("Couldn't insert value -- Duplicate found! Tree unchanged."))
            return
        }

        if (found !== null) { // find() returns null if it finds nothing
            if (found.length >= 1) {
                let moved = found[0] // moved is a duplicate of inserted value higher in the tree -- copy its children to append to inserted node at lower depth

                if (found.length === 2) {
                    let movedParent = found[1]
                    console.log('moved', moved, movedParent)

                    for (let prop in movedParent) { // delete moved node
                        if (movedParent[prop] === moved) {
                            movedParent[prop] = null
                        }
                    }
                }
                let biggest
                if (side === 'left') { // inserted node is left child of parent
                    if (moved.right) {
                        node.right = moved.right
                    }
                    if (moved.left) {
                        if (node.right) { // was there a moved.right?
                            biggest = this.findBiggest(node)
                            biggest.left = moved.left
                        } else {
                            // get nodes one by one and insert them
                        }
                    }
                } else if (side === 'right') { // inserted node is right child of parent
                    if (moved.left) {
                        node.left = moved.left
                    }
                    if (moved.right) {
                        if (node.left) { // was there a moved.left?
                            biggest = this.findBiggest(node.left)
                            biggest.right = moved.right
                        } else {
                           // get nodes one by one and insert them
                        }
                    }
                }
            }
        }

        // const parent = this.routerInsert(value)
        // let grandparent
        //
        // if (parent !== null) {
        //     grandparent = this.findParent(parent)
        //
        //     if (grandparent === null) {
        //         console.log('gp is root', 'parent:',parent, ' gp:',grandparent)
        //         if (value < parent.value) { // new node is left child of parent
        //             const node = new Node(value)
        //
        //             node.left = parent.left
        //             node.right = parent.left.right
        //
        //             parent.left.right = null
        //             parent.left = node
        //
        //             if (node.right !== null) {
        //                 this.remove(value, node.right) // check for + remove duplicates
        //             }
        //
        //         } else if (value > parent.value) { // new node is right child of parent
        //             const node = new Node(value)
        //
        //             node.right = parent.right
        //             node.left = parent.right.left
        //
        //             parent.right.left = null
        //             parent.right = node
        //
        //             if (node.left !== null) {
        //                 this.remove(value, node.left) // check for + remove duplicates
        //             }
        //
        //         } else if (value === parent.value) {
        //             console.log(new Error('Value is already at lowest depth! Therefore duplicate value! Tree unchanged.'))
        //         }
        //     } else {
        //         console.log('value:', value, ' parent:',parent,' grandparent:',grandparent)
        //
        //         for (let prop in grandparent) {
        //             if (grandparent[prop] === parent) {
        //                 let node = new Node(value)
        //
        //                 if (node.value > parent.value) { // new node will be right child of parent
        //                     if (prop === 'right') { // parent is right child of grandparent
        //
        //                         node.right = parent.right
        //                         parent.right = node
        //                         grandparent.right = parent
        //
        //                         if (node.right !== null) { // check to make sure the starting search node to pass to remove() isn't null, which sets starting node to root and will end up removing the value we just inserted
        //                             const duplicate = this.find(node.value, false, node.right)
        //
        //                             if (duplicate !== null) {
        //                                 if (duplicate.left !== null) {
        //                                     node.left = duplicate.left
        //                                     node.left.right = duplicate.right
        //                                 }
        //                             }
        //                             this.removeAll(value, node.right)
        //                         }
        //                         if (parent.left !== null) {
        //                             const duplicate = this.find(node.value, false, parent.left)
        //
        //                             if (duplicate !== null) {
        //                                 if (duplicate.left !== null) {
        //                                     node.left = duplicate.left
        //                                     node.left.right = duplicate.right
        //                                 }
        //                             }
        //                             this.removeAll(value, parent.left)
        //                         }
        //                     } else { // parent is left child of grandparent
        //                         node.left = parent.left
        //                         parent.left = node
        //                     }
        //                 } else if (node.value < parent.value) { // new node will be left child of parent
        //                     if (prop === 'left') { // parent is left child of grandparent
        //
        //                         node.left = parent.left
        //                         parent.left = node
        //                         grandparent.left = parent
        //
        //                         if (node.left !== null) { // check to make sure the starting search node to pass to remove() isn't null, which sets starting node to root and will end up removing the value we just inserted
        //                             const duplicate = this.find(node.value, false, node.left)
        //
        //                             if (duplicate !== null) {
        //                                 if (duplicate.right !== null) {
        //                                     node.right = duplicate.right
        //                                     node.right.left = duplicate.left
        //                                 }
        //                             }
        //                             this.removeAll(value, node.left) // check for + remove duplicates
        //                         } if (parent.right !== null) {
        //                             const duplicate = this.find(node.value, false, parent.left)
        //
        //                             if (duplicate !== null) {
        //                                 if (duplicate.right !== null) {
        //                                     node.right = duplicate.right
        //                                     node.right.left = duplicate.left
        //                                 }
        //                             }
        //                             this.removeAll(value, parent.right)
        //                         }
        //                     } else { // parent is right child of grandparent
        //                         node.right = parent.right
        //                         parent.right = node
        //                     }
        //                 } else if (node.value === parent.value) {
        //                     console.log(new Error('Value is already at lowest depth! Therefore duplicate value! Tree unchanged.'))
        //                     return
        //                 }
        //             }
        //         }
        //     }
        // } else {
        //     console.log("insert:", value, ' ', new Error('Value is already at lowest depth! Therefore duplicate value! Tree unchanged.'))
        // }
    }

    remove(value, node = null) {
        // console.log('remove -', 'starting node:',node)
        if (this.root.value === value) { // removing root
            node = this.root // root assigned to variable for readability

            if (node.left) {
                if (node.right) {
                    const biggest = this.findBiggest(node.left)
                    biggest.right = node.right
                }
                this.root = node.left
            } else if (this.root.right) {
                this.root = node.right
            } else {
                this.root = null
            }
        } else {
            // let node;
            let parent;
            const found = this.find(value, true, node)

            if (found !== null) {
                if (typeof found === 'object' && found.length === 2) {
                    node = found[0]
                    parent = found[1]
                }
            } else {
                console.log(new Error("Couldn't remove value, node not found!"))
                return
                // return found // return error from find(), value to be removed not found (or remove was called to check + remove)
            }

            if (node === parent.left) {
                if (node.left) {
                    if (node.right) {
                        const biggest = this.findBiggest(node.left)
                        biggest.right = node.right
                    }
                    parent.left = node.left
                } else if (node.right) {
                    parent.left = node.right
                } else {
                    parent.left = null
                }
            } else if (node === parent.right) {
                if (node.left) {
                    if (node.right) {
                        const biggest = this.findBiggest(node.left)
                        biggest.right = node.right
                    }
                    parent.right = node.left
                } else if (node.right) {
                    parent.right = node.right
                } else {
                    parent.right = null
                }
            }
        }
    }

    removeAll(value, node = null) {
        if (node === null) {
            node = this.root
        }
        if (node.value === value) { // first value checked (root or starting node) has value, so remove node
            if (node.left === null && node.right === null) {
                return
            } else {
                this.removeAll(node.left)
                this.removeAll(node.right)
                return
            }
        } else {
            const found = this.find(value, true, node)
            let parent;

            if (found !== null) {
                if (found.length === 2) {
                    node = found[0]
                    parent = found[1]

                    for (let prop in parent) {
                        if (parent[prop] === node) {
                            parent[prop] = null
                        }
                    }

                    if (node.left === null && node.right === null) {
                        node = null
                        return
                    } else {
                        this.removeAll(node.left)
                        this.removeAll(node.right)
                        node = null
                        return
                    }
                }
            } else {
                console.log(new Error("Couldn't remove value, node not found!"))
                return
                // return found // return error from find(), value to be removed not found (or remove was called to check + remove)
            }
        }
    }

    find(value, findParent = false, prev = this.root, curr = null) {
        if (prev === null) {
            prev = this.root

            if (value === prev.value) {
                if (findParent) {
                    return [prev, null]
                } else {
                    return prev
                }
            }
        }
        // console.log('find, prev:', prev, ' curr:', curr, ' val:', value)
        if (curr === null) {
             if (value === prev.value) { // value to find === root/starting node?
                 if (findParent) {
                     return [prev, this.findParent(prev)]
                 } else {
                    return prev // return root
                 }
             } else {
                 curr = prev
                 return this.find(value, findParent, prev, curr)
             }
        } else if (value === curr.value) {
            // console.log('find returning, fp:', findParent, ' curr:', curr, ' prev:', prev)
            if (findParent) {
                return [curr, prev]
            } else {
                return curr
            }
        } else if (value < curr.value) {
            if (curr.left) {
                prev = curr
                curr = curr.left
                return this.find(value, findParent, prev, curr)
            } else {
                return null
                // return new Error('Node not found!')
            }
        } else if (value > curr.value) {
            if (curr.right) {
                prev = curr
                curr = curr.right
                return this.find(value, findParent, prev, curr)
            } else {
                return null
                // return new Error('Node not found!')
            }
        } else if (!curr.value) {
            return new Error('Encountered node without value and cannot continue!')
        }
    }

    findParent(node, prev = this.root) {
        // console.log('findparent', node, prev)
        if (node === this.root) {
            return null
        }
        if (node !== prev.left && node !== prev.right) {
            if (node.value < prev.value) {
                prev = prev.left
                return this.findParent(node, prev)
            } else if (node.value > prev.value) {
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

    findBiggest(node = this.root) { // rename most right
        if (node.right) {
            return this.findBiggest(node.right)
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