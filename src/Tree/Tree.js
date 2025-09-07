import Node from "../Node"
import build from "../Tree/build"
import append from "../Tree/append"
import insert from "../Tree/insert"
import remove from "../Tree/remove"
import find from "../Tree/find"
import print from "../Tree/print"
import sort from "../Tree/sort"

export default class Tree {
    constructor(array) {
        this.build = build
        this.append = append.bind(this)
        this.insert = insert.bind(this)
        this.remove = remove.bind(this)
        this.find = find.bind(this)
        this.print = print.bind(this)

        array = sort(array)

        const midpoint = Math.round(array.length / 2) - 1
        this.root = new Node(array[midpoint])

        this.build(array.slice(0, midpoint), this.root) // build left side
        this.build(array.slice(midpoint + 1), this.root) // build right side
    }

    traverse(node, callback, mode = 'inorder') {
        if (mode === 'inorder') {
            this.inorder(node, callback)
        }
    }

    // remove(value, childrenToo = false, node = null) {
    //     // console.log('remove -', 'starting node:',node)
    //
    //     if (childrenToo) {
    //         removeAll(value, node)
    //     } else {
    //         if (this.root.value === value) { // removing root
    //             node = this.root // root assigned to variable for readability
    //
    //             if (node.left) {
    //                 if (node.right) {
    //                     const mostRight = this.findMostRight(node.left)
    //                     mostRight.right = node.right
    //                 }
    //                 this.root = node.left
    //             } else if (this.root.right) {
    //                 this.root = node.right
    //             } else {
    //                 this.root = null
    //             }
    //         } else {
    //             // let node;
    //             let parent;
    //             const found = this.find(value, true, node)
    //
    //             if (found !== null) {
    //                 if (typeof found === 'object' && found.length === 2) {
    //                     node = found[0]
    //                     parent = found[1]
    //                 }
    //             } else {
    //                 console.log(new Error("Couldn't remove value, node not found!"))
    //                 return
    //                 // return found // return error from find(), value to be removed not found (or remove was called to check + remove)
    //             }
    //
    //             if (node === parent.left) {
    //                 if (node.left) {
    //                     if (node.right) {
    //                         const mostRight = this.findMostRight(node.left)
    //                         mostRight.right = node.right
    //                     }
    //                     parent.left = node.left
    //                 } else if (node.right) {
    //                     parent.left = node.right
    //                 } else {
    //                     parent.left = null
    //                 }
    //             } else if (node === parent.right) {
    //                 if (node.left) {
    //                     if (node.right) {
    //                         const mostRight = this.findMostRight(node.left)
    //                         mostRight.right = node.right
    //                     }
    //                     parent.right = node.left
    //                 } else if (node.right) {
    //                     parent.right = node.right
    //                 } else {
    //                     parent.right = null
    //                 }
    //             }
    //         }
    //     }
    // }
    //
    // removeAll(value, node = null) {
    //     if (node === null) {
    //         node = this.root
    //     }
    //     if (node.value === value) { // first value checked (root or starting node) has value, so remove node
    //         if (node.left || node.right) {
    //             if (node.left) {
    //                 this.removeAll(node.left.value, node)
    //             }
    //             if (node.right) {
    //                 this.removeAll(node.right.value, node)
    //             }
    //         }
    //     } else {
    //         const found = this.find(value, true, node)
    //         let parent;
    //
    //         if (found !== null) {
    //             if (found.length === 2) {
    //                 node = found[0]
    //                 parent = found[1]
    //
    //                 for (let prop in parent) {
    //                     if (parent[prop] === node) {
    //                         parent[prop] = null
    //                     }
    //                 }
    //
    //                 if (node.left || node.right) {
    //                     if (node.left) {
    //                         this.removeAll(node.left.value, node)
    //                     }
    //                     if (node.right) {
    //                         this.removeAll(node.right.value, node)
    //                     }
    //                 }
    //                 node = null
    //
    //             } else {
    //                 console.log(new Error("Could remove all, find() didn't return two values!"))
    //             }
    //         } else {
    //             console.log(new Error("Couldn't remove value, node not found!"))
    //         }
    //     }
    // }
}