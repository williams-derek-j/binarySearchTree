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

            this.events.on('childHeightChange', () => {
                let l = 0
                let r = 0

                if (this.left) {
                    l = this.left.height
                } else {
                    l = -1 // = null
                }
                if (this.right) {
                    r = this.right.height
                } else {
                    r = -1
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
            })
            this._left = node
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
                    l = this.left.height
                } else {
                    l = -1 // = null
                }
                if (this.right) {
                    r = this.right.height
                } else {
                    r = -1
                }

                if (this.height <= l || this.height <= r) {
                    if (l < r) {
                        this.height = 1 + r
                    } else {
                        this.height = 1 + l
                    }
                } else {
                    if (l < r) {
                        if (this.height - r >= 2) {
                            this.height = r + 1
                        }
                    } else {
                        if (this.height - l >= 2) {
                            this.height = l + 1
                        }
                    }
                }
            })
            this._right = node
        } else {
            this._right = null
        }
    }

    get right() {
        return this._right
    }
}