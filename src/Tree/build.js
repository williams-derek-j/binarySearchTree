import Node from "../Node";
import traverse from "./traverse"

// chatGPT wrote this algorithm -- shifting binary is still beyond me atm
function generateGray(bit) {
    const total = 1 << bit;
    const out = [];
    for (let i = 0; i < total; i++) {
        // binary-reflected Gray code
        const g = i ^ (i >> 1);
        // convert to n-bit binary string
        let bits = g.toString(2).padStart(bit, '0');
        // reverse the bit order
        bits = bits.split('').reverse().join('');
        out.push(bits);
    }
    return out;
}
//

function grayPairs(array, grays = []) {
    if (array.length <= 2) {
        return array
    } else {
        const left = grayPairs(array.slice(0, array.length/2))
        const right = grayPairs(array.slice(array.length/2))

        grays.push(left)
        grays.push(right)

        return grays
    }
}

export function init(arrays, parents = []) {
    if (parents.length === 0) {
        if (arrays.length === 0) {
            return
        }
        const midpoint = Math.round(arrays[0].length / 2) - 1
        const root = new Node(arrays[0][midpoint])

        const splits = []
        splits.push(arrays[0].slice(0, midpoint))
        splits.push(arrays[0].slice(midpoint + 1))

        init(splits, [root])

        // find deepest childless nodes here
        let childless = []
        traverse((node) => {
            if (node.left === null && node.right === null) {
                childless.push(node)
            }
        },'inorder', root)

        console.log(childless)
        const bit = Math.log(childless.length) / Math.log(2)

        const gray = generateGray(bit)

        childless = grayPairs(childless)

        let str = 'childless'
        for (let i = 0; i < bit; i++) {
            str += `[x]`
        }
        gray.forEach((binary) => {
            for (let i = 0; i < bit; i++) {
                str = str.replace("x", binary[i])
            }
            eval(str).height = 0

            str = 'childless'
            for (let i = 0; i < bit; i++) {
                str += `[x]`
            }
        })


        return root
    } else {
        const children = []
        const splits = []

        for (let i = 0; i < parents.length; i++) { // for each parent from deeper tier,
            for (let j = i * 2; j < ((i * 2) + 2); j++) { // grab two arrays. arrays[j = 2i], arrays[j + 1]
                if (arrays[j].length > 1) {
                    const midpoint = Math.round(arrays[j].length / 2) - 1
                    const node = new Node(arrays[j][midpoint])
                    console.log('hey0', node.value)

                    if (j === i * 2) {
                        parents[i].left = node
                    } else if (j - 1 === i * 2) {
                        parents[i].right = node
                    } else {
                        console.log("!")
                    }
                    console.log('depth', parents[i].value, parents[i].depth)
                    node.depth = parents[i].depth + 1
                    // don't set height yet! find the deepest childless nodes and pass their heights up once the tree is fully built

                    children.push(node) // this is a queue -- each parent creates usually 2 children

                    if (arrays[j].length >= 3) {
                        splits.push(arrays[j].slice(0, midpoint))
                        splits.push(arrays[j].slice(midpoint + 1))
                    } else if (arrays[j].length === 2) {
                        splits.push([])
                        splits.push([arrays[j][1]])
                    } else {
                        splits.push([])
                        splits.push([])
                    }
                } else if (arrays[j].length === 1) {
                    const node = new Node(arrays[j][0])
                    console.log('hey', node.value)

                    if (j === i * 2) {
                        parents[i].left = node
                    } else if (j - 1 === i * 2) {
                        parents[i].right = node
                    }
                    console.log('depth', parents[i].value, parents[i].depth)
                    node.depth = parents[i].depth + 1
                    // don't set height yet! find the deepest childless nodes and pass their heights up once the tree is fully built

                    children.push(node)
                    splits.push([])
                    splits.push([])
                }
            }
        }
        return init(splits, children)
    }
}

export function buildB(arrays, parents = []) {
    // console.log('buildB', arrays, '\n\n parents:', parents)
    if (parents.length === 0) {
        if (arrays.length === 0) {
            return
        }
        const midpoint = Math.round(arrays[0].length / 2) - 1
        const root = new Node(arrays[0][midpoint])

        const splits = []
        splits.push(arrays[0].slice(0, midpoint))
        splits.push(arrays[0].slice(midpoint + 1))

        buildB(splits, [root])

        return root
    } else {
        const children = []
        const splits = []

        for (let i = 0; i < parents.length; i++) { // for each parent from deeper tier,
            for (let j = i * 2; j < ((i * 2) + 2); j++) { // grab two arrays. arrays[j = 2i], arrays[j + 1]
                if (arrays[j].length > 1) {
                    const midpoint = Math.round(arrays[j].length / 2) - 1
                    const node = new Node(arrays[j][midpoint])

                    if (j === i * 2) {
                         // console.log('pleft', node, parents[i])
                        parents[i].left = node
                    } else if (j - 1 === i * 2) {
                        parents[i].right = node
                    } else {
                        console.log("!")
                    }
                    node.depth = parents[i].depth + 1
                    node.height = 0

                    children.push(node) // each parent creates usually 2 children

                    if (arrays[j].length >= 3) {
                        splits.push(arrays[j].slice(0, midpoint))
                        splits.push(arrays[j].slice(midpoint + 1))
                    } else if (arrays[j].length === 2) {
                        splits.push([])
                        splits.push([arrays[j][1]])
                    } else {
                        splits.push([])
                        splits.push([])
                    }
                } else if (arrays[j].length === 1) {
                    const node = new Node(arrays[j][0])

                    if (j === i * 2) {
                        parents[i].left = node
                    } else if (j - 1 === i * 2) {
                        parents[i].right = node
                    }
                    node.depth = parents[i].depth + 1
                    node.height = 0

                    children.push(node)
                    splits.push([])
                    splits.push([])
                }
            }
        }
        return buildB(splits, children)
    }
}

export default function build(array, parent) {
    if (array.length === 1) {
        if (array[0] < parent.value) {
            const node = new Node(array[0]);
            node.depth = parent._depth + 1;

            parent.left = node
            node.height = 0

            // parent.left.height = 0
            // if (parent.right === null) {
            //     parent.height = parent.height + 1
            // }
        } else if (array[0] > parent.value) {
            const node = new Node(array[0]);
            node.depth = parent._depth + 1;

            parent.right = node
            node.height = 0

            // parent.right.height = 0
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
            // parent.left.height = 0

            node = new Node(array[1]);
            node.depth = parent._depth + 1;

            parent.right = node
            node.height = 0
            // parent.right.height = 0

            // parent.height = parent.height + 1

        } else if (array[1] < parent.value && array[0] > parent.value) { // reverse sorted
            let node = new Node(array[1]);
            node.depth = parent._depth + 1;

            parent.left = node
            node.height = 0
            // parent.left.height = 0

            node = new Node(array[0]);
            node.depth = parent._depth + 1;

            parent.right = node
            node.height = 0
            // parent.right.height = 0

            // parent.height = parent.height + 1

        } else if (array[0] < array[1]) { // array ordered left < right (right > left), both less or greater than parent
            if (array[1] < parent.value) { // both less than parent
                const node = new Node(array[1]);
                node.depth = parent._depth + 1;

                parent.left = node
                node.height = 0
                // parent.left.height = 0

                // parent.height = parent.height + 1

                build([array[0]], node) // parent.left.left
            }
            else if (array[0] > parent.value) { // both greater than parent
                const node = new Node(array[0])
                node.depth = parent._depth + 1;

                parent.right = node
                node.height = 0
                // parent.right.height = 0

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
                // parent.left.height = 0

                // parent.height = parent.height + 1

                build([array[1]], node) // parent.left.left
            }
            else if (array[1] > parent.value) { // both greater than parent
                const node = new Node(array[1]);
                node.depth = parent._depth + 1;

                parent.right = node
                node.height = 0
                // parent.right.height = 0

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
        console.log('mp', midpoint, array[midpoint])

        if (array[midpoint] < parent.value) {
            const node = new Node(array[midpoint])
            node.depth = parent._depth + 1

            console.log('pl', parent, node, array, parent.left)
            parent.left = node;
            node.height = 0
            // parent.left.height = 0
            console.log('pl2', parent.left)

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
            // parent.right.height = 0

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