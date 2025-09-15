import traverse from './traverse'
import { buildB } from "./build";

function findMostRight(node) { // rename most right
    if (node.right) {
        return findMostRight(node.right)
    } else {
        return node
    }
}

function removeAll(value, node = null, dis) {
    if (node === null) {
        node = dis.root
    }
    if (node.value === value) { // first value checked (root or starting node) has value, so remove node
        if (node.left || node.right) {
            if (node.left) {
                removeAll(node.left.value, node, dis)
                node.left = null // auto removes eventsP, events in .left/.right setters
            }
            if (node.right) {
                removeAll(node.right.value, node, dis)
                node.right = null
            }
        }
    } else {
        const found = dis.find(value, true, node)
        let parent;

        if (found !== null) {
            if (found.length === 2) {
                node = found[0]
                parent = found[1]
                // console.log('parent,',parent)

                parent.rebuildingChild = true

                if (node.left || node.right) {
                    if (node.left) {
                        removeAll(node.left.value, node, dis)
                        node.left = null // auto removes eventsP, events in .left/.right setters
                    }
                    if (node.right) {
                        removeAll(node.right.value, node, dis)
                        node.right = null
                    }
                }

                for (let prop in parent) {
                    if (parent[prop] === node) {
                        parent[prop] = null
                    }
                }

                parent.rebuildingChild = true

                if (!parent.isBalanced()) {
                    // console.log('not balanced this.value:', parent.value)
                    if (parent.eventsP) {
                        parent.eventsP.emit('childIsUnbalanced', parent)
                    } else {
                        const family = []
                        const deprecated = []

                        traverse((node) => {
                            family.push(node.value)
                            deprecated.push(node)
                        }, 'inorder', parent)

                        if (deprecated.length > 0) {
                            deprecated.forEach((node) => {
                                if (node.left !== null) {
                                    node.left = null
                                }
                                if (node.right !== null) {
                                    node.right = null
                                }
                            })
                        }

                        if (family.length > 0) {
                            dis.root = buildB([family])
                        }
                    }
                } else {
                    parent.updateHeight()
                }

            } else {
                console.log(new Error("Could remove all, find() didn't return two values!"))
            }
        } else {
            console.log(new Error("Couldn't remove value, node not found!"))
        }
    }
}

export default function remove(value, childrenToo = false, node = null) { // node is an optional parameter to make the remove function more efficient if the caller already has the node to be removed
    // console.log('remove', value, childrenToo, node)

    if (childrenToo) {
        removeAll(value, node, this)
    } else {
        if (this.root.value === value) { // removing root
            const removed = this.root // root assigned to variable for readability

            const family = []
            const deprecated = []

            if (removed.left) {
                traverse((node) => {
                    family.push(node.value)
                    deprecated.push(node)
                }, 'inorder', removed.left)
            }

            if (removed.right) {
                traverse((node) => {
                    family.push(node.value)
                    deprecated.push(node)
                }, 'inorder', removed.right)
            }

            if (deprecated.length > 0) {
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
            }

            if (family.length > 0) {
                // console.log('family', family, '\n this: ', this)
                const rebuilt = buildB([family])
                // console.log('rbh', rebuilt.height, 'rbd', rebuilt.depth, '\n\nrbv', rebuilt.value)

                this.root = rebuilt
                rebuilt.depth = 0
            } else { // no children to remove
                this.root = null
            }
        } else {
            if (node === null) {
                node = this.root
            }

            let parent
            let removed
            const found = this.find(value, true, node)

            if (found !== null) {
                if (typeof found === 'object' && found.length === 2) {
                    removed = found[0]
                    parent = found[1]
                }
            } else {
                console.log(new Error("Couldn't remove value, node not found!"))
                return
            }

            parent.rebuildingChild = true

            const family = []
            const deprecated = []

            if (removed.left) {
                traverse((node) => {
                    family.push(node.value)
                    deprecated.push(node)
                }, 'inorder', removed.left)
            }

            if (removed.right) {
                traverse((node) => {
                    family.push(node.value)
                    deprecated.push(node)
                }, 'inorder', removed.right)
            }

            if (deprecated.length > 0) {
                deprecated.forEach((node) => {
                    if (node.eventsP) {
                        // console.log('clearing eventsP', node)
                        node.eventsP = null
                    }
                    if (node.left !== null) {
                        node.left = null
                    }
                    if (node.right !== null) {
                        node.right = null
                    }
                })
            }

            if (family.length > 0) {
                // console.log('family', family, '\n this: ', this)
                const rebuilt = buildB([family])
                // console.log('rbh', rebuilt.height, 'rbd', rebuilt.depth, '\n\nrbv', rebuilt.value)

                for (let prop in parent) {
                    if (parent[prop] === removed) {
                        parent[prop] = rebuilt

                        rebuilt.depth = parent.depth + 1
                    }
                }
            } else {
                for (let prop in parent) {
                    if (parent[prop] === removed) {
                        removed.left = null
                        removed.right = null

                        // removed.eventsP = null // this should be unnecessary as eventsP and events are removed in the .left and .right setters if set to null
                        // removed.events = null

                        parent[prop] = null
                    }
                }
            }

            parent.rebuildingChild = false

            if (!parent.isBalanced()) {
                // console.log('not balanced this.value:', parent.value)
                if (parent.eventsP) {
                    parent.eventsP.emit('childIsUnbalanced', parent)
                }
            } else {
                parent.updateHeight()
            }
        }
    }
}