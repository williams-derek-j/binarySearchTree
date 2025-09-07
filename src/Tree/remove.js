function findMostRight(node) { // rename most right
    if (node.right) {
        return findMostRight(node.right)
    } else {
        return node
    }
}

function removeAll(value, node = null, dis) {
    if (node === null) {
        node = dis.root
    }
    if (node.value === value) { // first value checked (root or starting node) has value, so remove node
        if (node.left || node.right) {
            if (node.left) {
                removeAll(node.left.value, node, dis)
            }
            if (node.right) {
                removeAll(node.right.value, node, dis)
            }
        }
    } else {
        const found = dis.find(value, true, node)
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

                if (node.left || node.right) {
                    if (node.left) {
                        removeAll(node.left.value, node, dis)
                    }
                    if (node.right) {
                        removeAll(node.right.value, node, dis)
                    }
                }
                node = null

            } else {
                console.log(new Error("Could remove all, find() didn't return two values!"))
            }
        } else {
            console.log(new Error("Couldn't remove value, node not found!"))
        }
    }
}

export default function remove(value, childrenToo = false, node = null) {
    if (childrenToo) {
        removeAll(value, node, this)
    } else {
        if (this.root.value === value) { // removing root
            node = this.root // root assigned to variable for readability

            if (node.left) {
                if (node.right) {
                    const mostRight = findMostRight(node.left)
                    mostRight.right = node.right

                    node.right = null
                }
                this.root = node.left

                node.left = null
            } else if (node.right) {
                this.root = node.right

                node.right = null
            } else {
                this.root = null
            }
        } else {
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
            }

            if (node === parent.left) {
                if (node.left) {
                    if (node.right) {
                        const mostRight = findMostRight(node.left)
                        mostRight.right = node.right

                        node.right = null
                    }
                    parent.left = node.left

                    node.left = null
                } else if (node.right) {
                    parent.left = node.right

                    node.right = null
                } else {
                    parent.left = null
                }
            } else if (node === parent.right) {
                if (node.left) {
                    if (node.right) {
                        const mostRight = findMostRight(node.left)
                        mostRight.right = node.right

                        node.right = null
                    }
                    parent.right = node.left

                    node.left = null
                } else if (node.right) {
                    parent.right = node.right

                    node.right = null
                } else {
                    parent.right = null
                }
            }
        }
    }
}