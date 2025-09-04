import Node from "./Node"

export default class Branch {
    constructor() {
        this.root = null
    }

    findParent(node, prev = null) {
        if (prev === null) {
            prev = this.root
        }

        if (node !== prev.left && node !== prev.right) {
            if (node.value < prev.value) {
                prev = prev.left
                this.findParent(node, prev)
            } else {
                prev = prev.right
                this.findParent(node, prev)
            }
        } else {
            if (node === prev.left) {
                return prev
            } else if (node === prev.right) {
                return prev
            }
        }

    }

    router(node, value) {
        if (value < node.value) {
            while (node.left) {
                this.router(node.left, value)
            }
            return node
            // node.left = new Node(value)
        } else if (value > node.value) {
            while (node.right) {
                this.router(node.right, value)
            }
            return node
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
        if (this.root.value === value) {
            this.root = null
        } else {
            const node = this.router(this.root, value)

            if (node.value === value) {
                const parent = this.findParent(node)

                if (node === parent.left) {
                    parent.left = null
                    // need logic to merge left + right children of removed child node and assign to parent.left
                } else if (node === parent.right) {
                    parent.right = null
                    // need logic to merge left + right children of removed child and assign to parent.right
                }
            } else {
                return new Error("Value not found! Tree unchanged.")
            }
        }
    }
}