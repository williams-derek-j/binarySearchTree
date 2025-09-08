import Node from "../Node";

export default function build(array, parent) {
    if (array.length === 1) {
        if (array[0] < parent.value) {
            const node = new Node(array[0]);
            node.depth = parent._depth + 1;

            parent.left = node

            node.height = 0
            // if (parent.right === null) {
            //     parent.height = parent.height + 1
            // }
        } else if (array[0] > parent.value) {
            const node = new Node(array[0]);
            node.depth = parent._depth + 1;

            parent.right = node

            node.height = 0
            // if (parent.left === null) {
            //     parent.height = parent.height + 1
            // }
        } else { // same as parent, skip
            // could return parent node up recursion chain here
        }

    } else if (array.length <= 2) {
        if (array[0] < parent.value && array[1] > parent.value) { // sorted
            let node = new Node(array[0]);
            node.depth = parent._depth + 1;

            parent.left = node
            node.height = 0

            node = new Node(array[1]);
            node.depth = parent._depth + 1;

            parent.right = node
            node.height = 0

            // parent.height = parent.height + 1

        } else if (array[1] < parent.value && array[0] > parent.value) { // reverse sorted
            let node = new Node(array[1]);
            node.depth = parent._depth + 1;

            parent.left = node
            node.height = 0

            node = new Node(array[0]);
            node.depth = parent._depth + 1;

            parent.right = node
            node.height = 0

            // parent.height = parent.height + 1

        } else if (array[0] < array[1]) { // array ordered left < right (right > left), both less or greater than parent
            if (array[1] < parent.value) { // both less than parent
                const node = new Node(array[1]);
                node.depth = parent._depth + 1;

                parent.left = node
                node.height = 0

                // parent.height = parent.height + 1

                build([array[0]], node) // parent.left.left
            }
            else if (array[0] > parent.value) { // both greater than parent
                const node = new Node(array[0])
                node.depth = parent._depth + 1;

                parent.right = node
                node.height = 0

                // parent.height = parent.height + 1

                build([array[1]], node) // parent.right.right
            }
            else { // element === parent, skip
                if (array[0] !== array[1]) {  // both equal parent?
                    build([array[1]], parent) // skip duplicate element, append next
                }
            }

        } else if (array[1] < array[0]) { // array reverse ordered right < left (left > right), both less or greater than parent
            if (array[0] < parent.value) { // both les than parent
                const node = new Node(array[0]);
                node.depth = parent._depth + 1;

                parent.left = node
                node.height = 0

                // parent.height = parent.height + 1

                build([array[1]], node) // parent.left.left
            }
            else if (array[1] > parent.value) { // both greater than parent
                const node = new Node(array[1]);
                node.depth = parent._depth + 1;

                parent.right = node
                node.height = 0

                // parent.height = parent.height + 1

                build([array[0]], node) // parent.right.right
            }
            else { // element === parent, skip
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
            const node = new Node(array[midpoint])
            node.depth = parent._depth + 1

            parent.left = node;
            node.height = 0

            // if (parent.right === null) {
            //     parent.height = parent.height + 1
            // }

            build(array.slice(0, midpoint), node)
            build(array.slice(midpoint + 1), node)
        }
        else if (array[midpoint] > parent.value) {
            const node = new Node (array[midpoint])
            node.depth = parent._depth + 1;

            parent.right = node
            node.height = 0

            // if (parent.left === null) {
            //     parent.height = parent.height + 1
            // }

            build(array.slice(0, midpoint), node)
            build(array.slice(midpoint + 1), node)
        }
        else if (array[midpoint] === parent.value) {
            let noMid = [...array.slice(0, midpoint)]
            noMid += [...array.slice(midpoint + 1)]

            console.log(new Error('Check if array w/ duplicate midpoint merged correctly!'), '\n array:', array, '\n noMid:', noMid)
            build(noMid, parent)
        }
    }
}