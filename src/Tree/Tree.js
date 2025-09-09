import Node from "../Node"
import build from "../Tree/build"
import { buildB } from "../Tree/build"
import append from "../Tree/append"
import insert from "../Tree/insert"
import remove from "../Tree/remove"
import find from "../Tree/find"
import traverse from "../Tree/traverse"
import print from "../Tree/print"
import sort from "../Tree/sort"

export default class Tree {
    constructor(array) {
        this.build = build
        this.append = append.bind(this)
        this.insert = insert.bind(this)
        this.remove = remove.bind(this)
        this.find = find.bind(this)
        this.traverse = traverse.bind(this)
        this.print = print.bind(this)

        array = [sort(array)] //  buildB needs an array of arrays

        this.root = buildB(array)

        // const midpoint = Math.round(array.length / 2) - 1
        // this.root = new Node(array[midpoint])
        //
        // this.build(array.slice(0, midpoint), this.root) // build left side
        // this.build(array.slice(midpoint + 1), this.root) // build right side
    }

//     isBalanced(node) {
//         let left = node.left._height
//
//     //     let left = []
//     //     let right = []
//     //
//     //     if (node.left) {
//     //         left = this.isBalanced(node.left)
//     //     } else {
//     //         left = true
//     //     }
//     //
//     //     if (node.right) {
//     //         right = this.isBalanced(node.right)
//     //     } else {
//     //         right = true
//     //     }
//     //
//     //     if (left && right) {
//     //         return true
//     //     } else {
//     //         return false
//     //     }
//     // }
}