import traverse from './traverse'
import {buildB} from "./build";

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
            }
            if (node.right) {
                removeAll(node.right.value, node, dis)
            }
        }
    } else {
        const found = dis.find(value, true, node)
        let parent;

        if (found !== null) {
            if (found.length === 2) {
                node = found[0]
                parent = found[1]

                for (let prop in parent) {
                    if (parent[prop] === node) {
                        parent[prop] = null
                    }
                }

                if (node.left || node.right) {
                    if (node.left) {
                        removeAll(node.left.value, node, dis)
                    }
                    if (node.right) {
                        removeAll(node.right.value, node, dis)
                    }
                }
                node = null

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

            traverse((node) => {
                family.push(node.value)
                deprecated.push(node)
            }, 'inorder', removed.left)

            traverse((node) => {
                family.push(node.value)
                deprecated.push(node)
            }, 'inorder', removed.right)

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

            // console.log('family', family, '\n this: ', this)
            const rebuilt = buildB([family])
            // console.log('rbh', rebuilt.height, 'rbd', rebuilt.depth, '\n\nrbv', rebuilt.value)

            this.root = rebuilt
            rebuilt.depth = 0

            // if (node.left) {
            //     if (node.right) {
            //         const mostRight = findMostRight(node.left)
            //         mostRight.right = node.right
            //
            //         node.right = null
            //     }
            //     this.root = node.left
            //
            //     node.left = null
            // } else if (node.right) {
            //     this.root = node.right
            //
            //     node.right = null
            // } else {
            //     this.root = null
            // }
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
                        console.log('clearing eventsP', node)
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
            parent.updateHeight()

            // if (node === parent.left) {
            //     if (node.left) {
            //         if (node.right) {
            //             const mostRight = findMostRight(node.left)
            //             mostRight.right = node.right
            //
            //             node.right = null
            //         }
            //         parent.left = node.left
            //
            //         node.left = null
            //     } else if (node.right) {
            //         parent.left = node.right
            //
            //         node.right = null
            //     } else {
            //         parent.left = null
            //     }
            // } else if (node === parent.right) {
            //     if (node.left) {
            //         if (node.right) {
            //             const mostRight = findMostRight(node.left)
            //             mostRight.right = node.right
            //
            //             node.right = null
            //         }
            //         parent.right = node.left
            //
            //         node.left = null
            //     } else if (node.right) {
            //         parent.right = node.right
            //
            //         node.right = null
            //     } else {
            //         parent.right = null
            //     }
            // }
        }
    }
}