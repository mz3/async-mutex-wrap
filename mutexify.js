// array of unresolved async functions
const mutex = []

// functional equality comparator
const functionsEqual = (fn1, fn2) => fn1.toString() === fn2.toString()

// array equality comparator
const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = arr1.length; i--;) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }

  return true
}

// check if mutexed objects {fn, params} are equal
const checkEquality = (...items) => (
  functionsEqual(...items.map(item => item.fn)) &&
  arraysEqual(...items.map(item => item.params))
)

// splice item from the mutex array
const removeMutexItem = item => {
  const index = mutex.findIndex(mutexItem => checkEquality(mutexItem, item))
  mutex.splice(index, 1)
}

// fetch item from the mutex array
const findMutexItem = item =>
  mutex.find(mutexItem => checkEquality(mutexItem, item))

// main mutexify function
module.exports = function mutexify (fn) {
  return (...params) => {
    const mutexItem = {
      fn,
      params
    }
    // check if there is a pending call
    const foundItem = findMutexItem({fn, params})

    if (foundItem) {
      return foundItem.chain
    } else {
      // run the function, assume it returns a promise
      mutexItem.chain = fn(...params)
        .then(result => {
          removeMutexItem(mutexItem)
          return result
        })
        .catch(err => {
          removeMutexItem(mutexItem)
          throw err
        })

      // add this call to the mutex array
      mutex.push(mutexItem)

      return mutexItem.chain
    }
  }
}
