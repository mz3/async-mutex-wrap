const assert = require('assert')
const mutexify = require('./mutexify')
const delay = 300

it('mutex should work correctly for a simple function', () => {
  const fn = mutexify(() => Promise.resolve(1))
  return fn().then(result => {
    assert.equal(result, 1)
  })
})

it('mutex should work correctly for parallel async calls', () => {
  let counter = 0
  const myAsyncFunction = x => new Promise((resolve, reject) => {
    counter += x
    setTimeout(resolve, delay, counter)
  })

  // expect the result of both promise chains to be the same
  // if not, then ++counter ran twice and the mutex failed
  const promises = [
    mutexify(myAsyncFunction),
    mutexify(myAsyncFunction)
  ].map(fn =>
    fn(5).then(result => {
      assert.equal(result, 5)
    })
  )

  return Promise.all(promises)
})

it('mutex should handle parallel calls, but not non-parallel calls', () => {
  let counter = 0
  const myAsyncFunction = () => new Promise((resolve, reject) => {
    setTimeout(resolve, delay, ++counter)
  })

  // these 2 calls should run in parallel (return same)
  const promises = [
    mutexify(myAsyncFunction),
    mutexify(myAsyncFunction)
  ].map(fn =>
    fn().then(result => {
      assert.equal(result, 1)
    })
  )

  // the third call should run after the first two and not be handled/wrapped
  // by the mutex, returning 2
  return Promise.all(promises)
    .then(() => mutexify(myAsyncFunction)())
    .then(result => {
      assert.equal(result, 2)
    })
})
