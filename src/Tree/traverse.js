function preorder(node, callback) {
    callback(node)

    if (node.left) {
        preorder(node.left, callback)
    }
    if (node.right) {
        preorder(node.right, callback)
    }
}

function inorder(node, callback) {
    if (node.left) {
        inorder(node.left, callback)
    }
    callback(node)

    if (node.right) {
        inorder(node.right, callback)
    }
}

function postorder(node, callback) {
    if (node.left) {
        postorder(node.left, callback)
    }
    if (node.right) {
        postorder(node.right, callback)
    }
    callback(node)
}

export default function traverse(callback, mode = 'inorder', node = this.root) {
    if (mode === 'preorder') {
        preorder(node, callback)
    } else if (mode === 'inorder') {
        inorder(node, callback)
    } else if (mode === 'postorder') {
        postorder(node, callback)
    } else {
        return new Error('Mode not selected! Format is traverse(callback, mode, node)')
    }
}