export default class Node {
    constructor(value) {
        this.value = value

        this._left = null
        this._right = null

        this._depth = 0
        this._height = 0

        this.eventsP = null
        this.events = {
            node: this.value,
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

    set depth(value) {
        this._depth = value

        if (this.left) {
            this.left.depth = value + 1
        }
        if (this.right) {
            this.right.depth = value + 1
        }
    }

    set height(value) {
        this._height = this._height + value

        if (this.eventsP) {
            this.eventsP.emit('childHeightIncrease', value)
        } else {
            console.log(new Error("Node couldn't emit change event to parent, is node root? If not, something went wrong!"))
        }
    }

    set left(node) {
        node.eventsP = this.events

        this.events.on('childHeightIncrease', (increase) => {
            if (this.right === null) {
                this.height = increase
            }
        })

        this._left = node
    }

    set right(node) {
        node.eventsP = this.events

        this.events.on('childHeightIncrease', (increase) => {
            if (this.left === null) {
                this.height = increase
            }
        })

        this._right = node
    }

    get left() {
        return this._left
    }

    get right() {
        return this._right
    }
}