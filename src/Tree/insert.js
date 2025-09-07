import Node from "../Node";

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
    let side

    if (parent !== null) { // routerInsert() returns null if value already exists at lowest depth
        if (inserted.value < parent.value) { // inserted node will be left child of parent
            side = 'left' // left
            inserted.left = parent.left
            parent.left = inserted
        } else if (inserted.value > parent.value) { // inserted node will be right child of parent
            side = 'right' // right
            inserted.right = parent.right
            parent.right = inserted
        } else {
            console.log("!")
        }
    } else {
        console.log(new Error("Couldn't insert value -- Duplicate found at lowest depth! Tree unchanged."))
        return
    }

    if (found !== null) { // find() returns null if it finds nothing
        let moved = found[0] // moved is a duplicate of inserted value higher in the tree -- copy its children to append to inserted node at lower depth

        if (found.length === 2) {
            let movedParent = found[1]

            for (let prop in movedParent) { // delete moved node
                if (movedParent[prop] === moved) {
                    movedParent[prop] = null
                }
            }
        }

        let mostRight
        if (side === 'left') { // inserted node is left child of parent
            if (moved.right) {
                inserted.right = moved.right
            }
            if (moved.left) {
                if (inserted.right) { // was there a moved.right?
                    mostRight = findMostRight(inserted)
                    mostRight.left = moved.left
                } else {
                    const orphans = []

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
                }
            }
        } else if (side === 'right') { // inserted node is right child of parent
            if (moved.left) {
                inserted.left = moved.left
            }
            if (moved.right) {
                if (inserted.left) { // was there a moved.left?
                    mostRight = findMostRight(inserted.left)
                    mostRight.right = moved.right
                } else {
                    const orphans = []

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
    }
}