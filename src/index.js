import Tree from './Tree'

const test = new Tree([1,2,3,4,5,6,7,8,9,10,11])
test.append(0)
test.append(-1)
test.append(3)
console.log('a', test)
test.prettyPrint(test.root)
// console.log('b', test.prettyPrint(test.root))
console.log('find', test.find(0))
test.remove(6)
test.prettyPrint(test.root)

console.log('d',test)