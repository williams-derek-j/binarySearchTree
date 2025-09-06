import Node from "../Node";

function routerAppend(value, node = this.root) { // returns parent with empty child closest to value
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
        return null // return null -- there's a function to find nodes so just use that if that's what you're trying to do
    } else if (!node.value) {
        return new Error('Node.value is undefined!')
    }
}

export default function append(value) {
    const node = new Node(value)

    if (this.root) {
        const prev = routerAppend(value, this.root)

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