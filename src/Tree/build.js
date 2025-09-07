import Node from "../Node";

export default function build(array, parent) {
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
                    build([array[1]], parent.left) // both less than parent; parent.left.left
                } else {
                    // could return a leaf node up the recursion chain here
                }
            } else if (array[0] > parent.value) { // both greater than parent
                parent.right = new Node(array[0])

                build([array[1]], parent.right) // parent.right.right
            } else { // element === parent, skip
                if (array[0] !== array[1]) {  // both equal parent?
                    build([array[1]], parent) // skip duplicate element, append next
                }
            }
        } else if (array[1] < array[0]) {
            if (array[1] < parent.value) {
                parent.left = new Node(array[1])

                if (array[0] !== parent.value) { // check for duplicate as fail condition
                    build([array[0]], parent.left) // both less than parent; parent.left.left
                } else {
                    // could return a leaf node up the recursion chain here
                }
            } else if (array[1] > parent.value) { // both greater than parent
                parent.right = new Node(array[1])

                build([array[0]], parent.right) // parent.right.right
            } else { // element === parent, skip
                if (array[1] !== array[0]) { // both equal parent?
                    build([array[0]], parent) // skip duplicate element, append next
                }
            }
        } else if (array[0] !== array[1]) { // check if both values same as fail condition
            build([array[0]], parent) // remove duplicate and try again
        }
    } else if (array.length >= 3) {
        const midpoint = Math.round(array.length / 2) - 1

        if (array[midpoint] < parent.value) {
            parent.left = new Node(array[midpoint])

            build(array.slice(0, midpoint), parent.left)
            build(array.slice(midpoint + 1), parent.left)
        } else if (array[midpoint] > parent.value) {
            parent.right = new Node(array[midpoint])

            build(array.slice(0, midpoint), parent.right)
            build(array.slice(midpoint + 1), parent.right)
        } else if (array[midpoint] === parent.value) {
            let noMid = [...array.slice(0, midpoint)]
            noMid += [...array.slice(midpoint + 1)]

            console.log('check if array w/ duplicate midpoint merged correctly: ', array, noMid)
            build(noMid, parent)
        }
    }
}