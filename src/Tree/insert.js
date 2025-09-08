import Node from "../Node";

function findHeight(node) {
    let l = 0
    let r = 0

    if (node.left === null && node.right === null) {
        return l
    } else {
        if (node.left) {
            l = 1 + findHeight(node.left)
        }
        if (node.right) {
            r = 1 + findHeight(node.right)
        }

        if (l === r) {
            return l
        } else if (l < r) {
            return r
        } else if (l > r) {
            return l
        }
    }
}

function findMostRight(node) { // rename most right
    if (node.right) {
        return findMostRight(node.right)
    } else {
        return node
    }
}

function routerInsert(value, node) { // returns parent whose occupied child slots are first place inserted value fits, rather than first empty child
    if (value < node.value) {
        if (node.left) {
            if (value > node.left.value) { // found appropriate occupied child slot
                return node // returns parent of occupied child slot
            } else if (value < node.left.value) {
                return routerInsert(value, node.left)
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
                return routerInsert(value, node.right)
            } else {
                return null // duplicate found at lowest possible depth, return null
            }
        } else { // found empty child slot
            return node // returns parent of empty child slot
        }
    }
}

export default function insert(value, node = this.root, checkDuplicates = true) {
    let found = null;

    if (checkDuplicates === true) {
        found = this.find(value, true, node)
    }

    const inserted = new Node(value)
    const parent = routerInsert(value, node)

    if (parent !== null) { // routerInsert() returns null if value already exists at lowest depth
        if (inserted.value < parent.value) { // inserted node will be left child of parent
            inserted.left = parent.left
            parent.left = inserted

            if (inserted.left !== null) {
                inserted.height = inserted.left.height + 1
            }
        } else if (inserted.value > parent.value) { // inserted node will be right child of parent
            inserted.right = parent.right
            parent.right = inserted

            if (inserted.right !== null) {
                inserted.height = inserted.right.height + 1
            }
        } else {
            console.log("!")
        }
        inserted.depth = parent._depth + 1
    } else {
        console.log(new Error("Couldn't insert value -- Duplicate found at lowest depth! Tree unchanged."))
        return
    }

    if (found !== null) { // find() returns null if it finds nothing
        let moved = found[0] // moved is a duplicate of inserted value higher in the tree -- copy its children to append to inserted node at lower depth

        moved.height = -1  // send event up chain and force parent+ to compare updated heights of children

        if (found.length === 2) {
            let movedParent = found[1]

            for (let prop in movedParent) { // delete moved node
                if (movedParent[prop] === moved) {
                    movedParent[prop] = null
                }
            }
        }

        let orphans = []

        if (moved.left !== null) {
            this.traverse((node) => {
                orphans.push(node.value)

                if (node.left) { // remove nodes of orphans we are re-inserting
                    node.left = null
                }
                if (node.right) {
                    node.right = null
                }
            }, 'inorder', moved.left)

            orphans.forEach((orphan) => {
                this.insert(orphan, inserted, false)
            })

            orphans = []
        }

        if (moved.right !== null) {
            this.traverse((node) => {
                orphans.push(node.value)

                if (node.left) { // remove nodes of orphans we are re-inserting
                    node.left = null
                }
                if (node.right) {
                    node.right = null
                }
            }, 'inorder', moved.right)

            orphans.forEach((orphan) => {
                this.insert(orphan, inserted, false)
            })
        }
    }
}