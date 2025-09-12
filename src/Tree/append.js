import Node from "../Node";

function routerAppend(value, node) { // returns parent with empty child closest to value
    if (value < node.value) {
        if (node.left) { // at end of tree?
            return routerAppend(value, node.left) // not yet, recurse
        } else {
            return node // yes, return parent
        }
    } else if (value > node.value) {
        if (node.right) { // at end of tree?
            return routerAppend(value, node.right) // not yet, recurse
        } else {
            return node // yes, return parent
        }
    } else if (value === node.value) { // node with value already exists?
        return null
    } else if (!node.value) {
        return new Error('Node.value is undefined!')
    }
}

export default function append(value, node = this.root) {
    const appended = new Node(value)

    if (this.root !== null) {
        const parent = routerAppend(value, node)

        if (parent !== null) { // router returns null if duplicate found
            if (value < parent.value) {
                appended.depth = parent.depth + 1

                // appended.height = 0
                parent.left = appended
                parent.left.height = 0

                // if (parent.right === null) {
                //     parent.height = parent.height + 1
                // }
            } else {
                appended.depth = parent.depth + 1

                // appended.height = 0
                parent.right = appended
                parent.right.height = 0

                // if (parent.left === null) {
                //     parent.height =  parent.height + 1
                // }
            }
        } else { // duplicate found
            return new Error("Duplicate value! Tree unchanged.")
        }
        // appended.depth = parent.depth + 1
        // appended.height = 0
    } else {
        this.root = appended

        this.root.height = 0
    }
}