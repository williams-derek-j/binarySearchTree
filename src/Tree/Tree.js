import Node from "../Node"
import build from "../Tree/build"
import { buildB } from "../Tree/build"
import { init } from "../Tree/build"
import append from "../Tree/append"
import remove from "../Tree/remove"
import find from "../Tree/find"
import traverse from "../Tree/traverse"
import print from "../Tree/print"
import sort from "../Tree/sort"

export default class Tree {
    constructor(array) {
        this.build = build
        this.append = append.bind(this)
        this.remove = remove.bind(this)
        this.find = find.bind(this)
        this.traverse = traverse.bind(this)
        this.print = print.bind(this)

        array = [sort(array)] //  buildB needs an array of arrays

        this.root = buildB(array)
    }
}