import build from "./Tree/build"
import { buildB } from "./Tree/build"
import traverse from "./Tree/traverse"

export default class Node {
    constructor(value) {
        this.__value = value

        this._left = null
        this._right = null

        this._depth = 0
        this._height = 0

        this.balanceChildren = false
        this.rebuildingChild = false

        this.eventsP = null
        this.events = {
            node: this._value,
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

        if (this.left) {
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
            console.log('emit to P', value, this.value)
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
        if (l === null || r === null) {
            [l, r] = this.heightChildren()
        }

        if (this.height <= l || this.height <= r) {
            if (l < r) {
                this.height = 1 + r
            } else { // l > r or l == r
                this.height = 1 + l
            }
        } else {
            if (l < r) {
                if (this.height - r >= 2) {
                    this.height = r + 1
                }
            } else { // l > r or l == r
                if (this.height - l >= 2) {
                    this.height = l + 1
                }
            }
        }
    }

    isBalanced() {
        [l, r] = this.heightChildren()

        return Math.sqrt((l - r) ** 2) > 1;
    }

    rebuild(child) {
        // console.log('rebuild', 'this:', this.value, this, '\n child:', child.value, child)
        this.rebuildingChild = true

        const family = []
        const deprecated = []

        // console.log('VVVVVVVVVVVVVVVVVVVVV')
        // traverse(console.log, 'inorder', child)

        traverse((node) => {
            // console.log('node:', node.value)
            family.push(node.value)
            deprecated.push(node)
        }, 'inorder', child)

        deprecated.forEach((node) => {
            if (node.left) { // remove nodes of orphans we are re-inserting
                node.left = null
            }
            if (node.right) {
                node.right = null
            }
        })

        // console.log('family', family, '\n this: ', this)
        const rebuilt = buildB([family])
        console.log('rbh', rebuilt.height, 'rbhd', rebuilt.depth, '\n\nrbv', rebuilt.value)

        for (let prop in this) {
            if (this[prop] === child) {
                this[prop] = rebuilt

                // rebuilt.depth = this[prop].depth + 1
            }
        }
        // console.log('thiasdasdasds', this, this.left.height, this.right.height)

        this.rebuildingChild = false
        this.updateHeight()
    }

    set left(node) {
        if (node !== null) {
            if (this.height > 0) {
                this.balanceChildren = true
            }

            node.eventsP = this.events

            this.events.on('childIsUnbalanced', (child) => {
                console.log('emit p', 'child:', child.value, '\nP:', this.value)
                this.rebuild(child)
            })

            this.events.on('childHeightChange', () => {
                const [l, r] = this.heightChildren()
                // console.log(this.value, l, r)

                if (l < r) {
                    if ((r - l) > 1) {
                        if (this.eventsP) {
                            // console.log('emit c', this.value, [l, r], this.left.value, this.right.value)
                            this.eventsP.emit('childIsUnbalanced', this)
                            return // don't update height, call an event asking parent to rebuild node instead
                        }
                    }
                } else if (r < l) {
                    if ((l - r) > 1) {
                        if (this.eventsP) {
                            // console.log('emit c', this.value, [l, r], this.left.value, this.right.value)
                            this.eventsP.emit('childIsUnbalanced', this)
                            return // don't update height, call an event asking parent to rebuild node instead
                        }
                    }
                }

                this.updateHeight(l, r)
            })
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
        if (node !== null) {
            this.balanceChildren = true

            node.eventsP = this.events

            this.events.on('childIsUnbalanced', (child) => {
                console.log('emit p', 'child:', child.value, '\nP:', this.value)
                this.rebuild(child)
            })

            this.events.on('childHeightChange', () => {
                const [l, r] = this.heightChildren()
                // console.log(this.value, l, r)

                if (l < r) {
                    if ((r - l) > 1) {
                        if (this.eventsP) {
                            this.eventsP.emit('childIsUnbalanced', this)
                            return // don't update height, call an event asking parent to rebuild node instead
                        }
                    }
                } else if (r < l) {
                    if ((l - r) > 1) {
                        if (this.eventsP) {
                            this.eventsP.emit('childIsUnbalanced', this)
                            return // don't update height, call an event asking parent to rebuild node instead
                        }
                    }
                }

                this.updateHeight(l, r)
            })
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