export default class Node {
    constructor(value) {
        this.__value = value

        this._left = null
        this._right = null

        this._depth = 0
        this._height = 0

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
                    };
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
        // console.log('setheight', value, this, this.height)
        this._height = value

        if (this.eventsP) {
            this.eventsP.emit('childHeightChange')
        } else {
            // console.log(new Error("Node couldn't emit change event to parent, is node root? If not, something went wrong!"))
        }
    }

    get height() {
        return this._height
    }

    set left(node) {
        if (node !== null) {
            node.eventsP = this.events

            this.events.on('childHeightChange', (increase) => {
                let l = 0
                let r = 0

                if (this.left) {
                    l = this.findHeight(this.left)
                }
                if (this.right) {
                    r = this.findHeight(this.right)
                }

                if (l < r) {
                    this.height = 1 + r
                } else {
                    this.height = 1 + l
                }
            })

            this._left = node

            if (this.right === null) {
                this.height = 1
            }
        } else {
            this._left = null
        }
    }

    get left() {
        return this._left
    }

    set right(node) {
        if (node !== null) {
            node.eventsP = this.events

            this.events.on('childHeightChange', () => {
                let l = 0
                let r = 0

                if (this.left) {
                    l = this.findHeight(this.left)
                }
                if (this.right) {
                    r = this.findHeight(this.right)
                }

                if (l < r) {
                    this.height = 1 + r
                } else {
                    this.height = 1 + l
                }
            })
            this._right = node

            if (this.left === null) {
                this.height = 1
            }
        } else {
            this._right = null
        }
    }

    get right() {
        return this._right
    }

    findHeight(node) {
        let left = 0
        let right = 0

        if (node.left === null && node.right === null) {
            return left
        } else {
            if (node.left) {
                left = 1 + this.findHeight(node.left)
            }
            if (node.right) {
                right = 1 + this.findHeight(node.right)
            }

            if (left === right) {
                return left
            } else if (left < right) {
                return right
            } else if (left > right) {
                return left
            }
        }
    }
}