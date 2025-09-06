import Node from "../Node";

function findMostRight(node) { // rename most right
    console.log(node)
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

export default function insert(value, node = this.root) {
    const found = this.find(value, true, node) // could search starting from return value of routerInsert

    const inserted = new Node(value)
    const parent = routerInsert(value, node)
    let side

    console.log('ip',inserted,parent,'found',found)
    if (parent !== null) { // routerInsert() returns null if value already exists at lowest depth
        console.log('parentn ot null', parent, parent.value, inserted.value, inserted.value < parent.value)
        if (inserted.value < parent.value) { // inserted node will be left child of parent
            console.log("???")
            side = 'left' // left
            inserted.left = parent.left
            parent.left = inserted
            console.log('side00', side)
        } else if (inserted.value > parent.value) { // inserted node will be right child of parent
            console.log("???")
            side = 'right' // right
            inserted.right = parent.right
            parent.right = inserted
            console.log('side00', side)
        } else {
            console.log("???wtf")
        }
    } else {
        console.log(new Error("Couldn't insert value -- Duplicate found! Tree unchanged."))
        return
    }
    console.log(typeof inserted, inserted)
    console.log('size0', side)

    if (found !== null) { // find() returns null if it finds nothing
        let moved = found[0] // moved is a duplicate of inserted value higher in the tree -- copy its children to append to inserted node at lower depth

        console.log('moved', moved)
        if (found.length === 2) {
            let movedParent = found[1]

            for (let prop in movedParent) { // delete moved node
                if (movedParent[prop] === moved) {
                    movedParent[prop] = null
                }
            }
        }
        let mostRight
        console.log('side', side)
        if (side === 'left') { // inserted node is left child of parent
            if (moved.right) {
                console.log('insertedL', inserted)
                inserted.right = moved.right
            }
            if (moved.left) {
                console.log('inserted1L', inserted)
                if (inserted.right) { // was there a moved.right?
                    console.log('fmr', inserted)
                    mostRight = findMostRight(inserted)
                    mostRight.left = moved.left
                } else {
                    // get nodes one by one and insert them
                }
            }
        } else if (side === 'right') { // inserted node is right child of parent
            if (moved.left) {
                console.log('insertedR', inserted)
                inserted.left = moved.left
            }
            if (moved.right) {
                console.log('inserted1R', inserted)
                if (inserted.left) { // was there a moved.left?
                    console.log('fmr1', inserted)
                    mostRight = findMostRight(inserted.left)
                    mostRight.right = moved.right
                } else {
                    // get nodes one by one and insert them
                }
            }
        }
    }
}