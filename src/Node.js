import build from "./Tree/build"
import { buildB } from "./Tree/build"
import { init } from "./Tree/build"
import traverse from "./Tree/traverse"

export default class Node {
    constructor(value) {
        console.log('********* node created', value)
        this.__value = value

        this._left = null
        this._right = null

        this._depth = 0
        this._height = 0

        this.rebuildingChild = false

        this.eventsP = null
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
    }
    set value(value) {
        this.__value = value;
    }

    get value() {
        return this.__value
    }

    set depth(value) {
        this._depth = value

        if (this.left) { // propagate to leaves
            this.left.depth = value + 1
        }
        if (this.right) {
            this.right.depth = value + 1
        }
    }

    get depth() {
        return this._depth
    }

    set height(value) {
        // console.log('sh', this.value, value)
        if (this.rebuildingChild === true) {
            return
        }

        this._height = value

        if (this.eventsP) {
            console.log('setheight emit to P val:', value, 'this:', this.value)
            this.eventsP.emit('childHeightChange')
        } else {
            // console.log(new Error("Node couldn't emit change event to parent, is node root? If not, something went wrong!"))
        }
    }

    get height() {
        return this._height
    }

    heightChildren() {
        let l = 0
        let r = 0

        if (this.left) {
            l = this.left.height
        } else {
            l = -1 // = null, if set to zero a subtree can mistakenly be built with two nodes on left child and zero on right child
        }
        if (this.right) {
            r = this.right.height
        } else {
            r = -1
        }

        return [l, r]
    }

    updateHeight(l = null, r = null) {
        console.log('updateHeight', 'this:', this.value, this, '\n\n l, r', l, r)
        if (l === null || r === null) {
            [l, r] = this.heightChildren()
        }

        if (this._height <= l || this._height <= r) {
            if (l < r) {
                this.height = 1 + r
            } else { // l > r or l == r
                this.height = 1 + l
            }
        } else {
            if (l < r) {
                if (this._height - r >= 2) {
                    this.height = r + 1
                }
            } else { // l > r or l == r
                if (this._height - l >= 2) {
                    this.height = l + 1
                }
            }
        }
        console.log('height after update', this.height)
    }

    isBalanced(l = null, r = null) {
        [l, r] = this.heightChildren()
        console.log('isB() this.value', this.value,'l,r', l,r)

        return Math.sqrt((l - r) ** 2) <= 1;
    }

    rebuild(child) {
        console.log('***************************************rebuild()', 'parent/this:', this.value, this, '\n child to rebuild:', child.value, child)
        this.rebuildingChild = true

        const family = []
        const deprecated = []

        traverse((node) => {
            // console.log('node:', node.value)
            family.push(node.value)
            deprecated.push(node)
        }, 'inorder', child)

        deprecated.forEach((node) => {
            if (node.eventsP) {
                console.log('clearing eventsP', node)
                node.eventsP = null
            }
            if (node.left !== null) {
                node._left = null
            }
            if (node.right !== null) {
                node._right = null
            }
        })

        console.log('family', family, '\n this: ', this)
        const rebuilt = init([family])
        console.log('rbh', rebuilt.height, 'rbd', rebuilt.depth, '\n\nrbv', rebuilt.value)

        for (let prop in this) {
            if (this[prop] === child) {
                this[prop] = rebuilt

                // rebuilt.depth = this[prop].depth + 1
            }
        }

        this.rebuildingChild = false
        this.updateHeight()
        console.log('done rebuilding child, this.value:', this.value)
    }

    set left(node) {
        if (this.left !== null) {
            if (this.left.eventsP) { // prevent removed node from firing events on parent
                this._left.eventsP = null
            }
            this._left = null
        }
        if (node !== null) {
            node.eventsP = this.events

            // console.log('check unbalanced left', ('childIsUnbalanced' in this.events), ('childIsUnbalanced' in this.events.events))
            if (!('childIsUnbalanced' in this.events.events)) {
                this.events.on('childIsUnbalanced', (child) => {
                    console.log('emit p unblaanced', 'child:', child.value, '\nP:', this.value)
                    this.rebuild(child)
                })
            }

            // console.log('check height left', ('childHeightChange' in this.events), ('childHeightChange' in this.events.events))
            if (!('childHeightChange' in this.events.events)) {
                this.events.on('childHeightChange', () => {
                    const [l, r] = this.heightChildren()
                    console.log('height of child changed', 'this:', this.value, 'child:', node.value, 'l,r', l, r)

                    if (!this.isBalanced()) {
                        console.log('not balanced this.value:', this.value)
                        if (this.eventsP) {
                            this.eventsP.emit('childIsUnbalanced', this)
                        }
                    } else {
                        this.updateHeight(l, r)
                    }
                })
            }
            this._left = node
        } else {
            if (this.right === null) {
                this.events.off('childIsUnbalanced')
                this.events.off('childHeightChange')
            }
            this._left = null
        }
    }

    get left() {
        return this._left
    }

    set right(node) {
        if (this.right !== null) {
            if (this.right.eventsP) { // prevent removed node from firing events on parent
                this._right.eventsP = null
            }
            this._right = null
        }
        if (node !== null) {
            node.eventsP = this.events

            // console.log('check unbalanced', ('childIsUnbalanced' in this.events), ('childIsUnbalanced' in this.events.events))
            if (!('childIsUnbalanced' in this.events.events)) {
                this.events.on('childIsUnbalanced', (child) => {
                    console.log('emit p unbalanced', 'child:', child.value, '\nP:', this.value)
                    this.rebuild(child)
                })
            }

            // console.log('check height right', ('childHeightChange' in this.events), ('childHeightChange' in this.events.events))
            if (!('childHeightChange' in this.events.events)) {
                this.events.on('childHeightChange', () => {
                    const [l, r] = this.heightChildren()
                    console.log('height of child changed', 'this:', this.value, 'child:', node.value, 'l,r', l, r)

                    if (!this.isBalanced()) {
                        console.log('not balanced this.value:', this.value)
                        if (this.eventsP) {
                            this.eventsP.emit('childIsUnbalanced', this)
                        }
                    } else {
                        this.updateHeight(l, r)
                    }
                })
            }
            this._right = node
        } else {
            if (this.left === null) {
                this.events.off('childIsUnbalanced')
                this.events.off('childHeightChange')
            }
            this._right = null
        }
    }

    get right() {
        return this._right
    }
}