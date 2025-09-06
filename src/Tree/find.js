function findParent(node, prev) {
    // console.log('findparent', node, prev)
    if (node === this.root) {
        return null
    }
    if (node !== prev.left && node !== prev.right) {
        if (node.value < prev.value) {
            prev = prev.left
            return findParent(node, prev)
        } else if (node.value > prev.value) {
            prev = prev.right
            return findParent(node, prev)
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

export default function find(value, wantsParent = false, prev = this.root, curr = null) {
    if (prev === null) {
        prev = this.root

        if (value === prev.value) {
            if (wantsParent) {
                return [prev, null]
            } else {
                return prev
            }
        }
    }
    // console.log('find, prev:', prev, ' curr:', curr, ' val:', value)
    if (curr === null) {
        if (value === prev.value) { // value to find === root/starting node?
            if (wantsParent) {
                return [prev, findParent(prev, this.root)]
            } else {
                return prev // return root
            }
        } else {
            curr = prev
            return find(value, wantsParent, prev, curr)
        }
    } else if (value === curr.value) {
        // console.log('find returning, fp:', wantsParent, ' curr:', curr, ' prev:', prev)
        if (wantsParent) {
            return [curr, prev]
        } else {
            return curr
        }
    } else if (value < curr.value) {
        if (curr.left) {
            prev = curr
            curr = curr.left
            return find(value, wantsParent, prev, curr)
        } else {
            return null
            // return new Error('Node not found!')
        }
    } else if (value > curr.value) {
        if (curr.right) {
            prev = curr
            curr = curr.right
            return find(value, wantsParent, prev, curr)
        } else {
            return null
            // return new Error('Node not found!')
        }
    } else if (!curr.value) {
        return new Error('Encountered node without value and cannot continue!')
    }
}