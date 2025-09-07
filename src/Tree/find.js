export default function find(value, wantsParent = false, prev = this.root, shallow = false, curr = null) {
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
    let temp

    if (curr === null) {
        if (value === prev.value) { // value to find === root/starting node?
            return new Error("Value found is in root node or the node you selected to begin your search from! Therefore no parent to return!")
        } else {
            curr = prev
            return this.find(value, wantsParent, prev, false, curr)
        }
    } else if (value === curr.value) {
        if (wantsParent) {
            return [curr, prev]
        } else {
            return curr
        }
    } else if (value < curr.value) {
        if (curr.left) {
            temp = prev
            prev = curr
            curr = curr.left

            const found = this.find(value, wantsParent, prev, false, curr)
            if (found !== null) {
                return found
            } else {
                curr = prev
                prev = temp
            }
        }
        if (curr.right && curr !== this.root && shallow === false) {
            prev = curr
            curr = curr.right

            return this.find(value, wantsParent, prev, false, curr)
        } else {
            return null
        }
    } else if (value > curr.value) {
        if (curr.right) {
            temp = prev
            prev = curr
            curr = curr.right

            const found = this.find(value, wantsParent, prev, false, curr)
            if (found !== null) {
                return found
            } else {
                curr = prev
                prev = temp
            }
        }
        if (curr.left && curr !== this.root && shallow === false) {
            prev = curr
            curr = curr.left

            return this.find(value, wantsParent, prev, false, curr)
        } else {
            return null
        }
    } else if (!curr.value) {
        return new Error('Encountered node without value and cannot continue!')
    }
}