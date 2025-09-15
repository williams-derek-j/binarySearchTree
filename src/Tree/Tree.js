import { buildB } from "../Tree/build"
import append from "../Tree/append"
import remove from "../Tree/remove"
import find from "../Tree/find"
import traverse from "../Tree/traverse"
import print from "../Tree/print"
import sort from "../Tree/sort"

export default class Tree {
    constructor(array) {
        this.append = append.bind(this)
        this.remove = remove.bind(this)
        this.find = find.bind(this)
        this.traverse = traverse.bind(this)
        this.print = print.bind(this)
        this.events = {
            node: this.__value,
            events: {},
            on: function (eventName, fn) {
                this.events[eventName] = this.events[eventName] || [];
                this.events[eventName].push(fn);
            },
            off: function(eventName, fn) {
                if (this.events[eventName]) {
                    for (var i = 0; i < this.events[eventName].length; i++) {
                        if (this.events[eventName][i] === fn) {
                            this.events[eventName].splice(i, 1);
                            break;
                        }
                    }
                }
            },
            emit: function (eventName, data) {
                if (this.events[eventName]) {
                    this.events[eventName].forEach(function(fn) {
                        fn(data);
                    });
                }
            }
        }
        // array = [sort(array)] //  buildB needs an array of arrays
        this.root = buildB([sort(array)]) // buildB needs an array of arrays and returns root node
    }

    set root(node) {
        if (this.root !== undefined) {
            if (this.root.eventsP) { // prevent removed node from firing events on parent
                this.root.eventsP = null
                this.root.events = null
            }
            this._root = null
        }

        if (node !== null) {
            node.eventsP = this.events

            // console.log('check unbalanced root')
            if (!('childIsUnbalanced' in this.events.events)) {
                this.events.on('childIsUnbalanced', (child) => {
                    // console.log('emit p unblaanced', 'child:', child.value, '\nP:', this.value)
                    this.rebuild(child)
                })
            }
        }

        this._root = node
    }

    get root() {
        return this._root
    }

    rebuild(child) {
        // console.log('***************************************tree rebuild()', 'parent/this:', this, '\n root to rebuild:', child.value, child)

        const family = []
        const deprecated = []

        traverse((node) => {
            family.push(node.value)
            deprecated.push(node)
        }, 'inorder', child)

        deprecated.forEach((node) => {
            if (node.eventsP) {
                // console.log('clearing eventsP', node)
                node.eventsP = null
            }
            if (node.left !== null) {
                node._left = null
            }
            if (node.right !== null) {
                node._right = null
            }
        })

        // console.log('family', family, '\n this: ', this)
        const rebuilt = buildB([family])
        // console.log('rbh', rebuilt.height, 'rbd', rebuilt.depth, '\n\nrbv', rebuilt.value)

        this.root = rebuilt

        rebuilt.depth = 0
        rebuilt.updateHeight()

        // console.log('done rebuilding child, this.value:', this.value)
    }
}