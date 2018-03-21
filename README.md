# async-mutex-wrap

A singleton-backed wrapper that can prevent parallel calls to a function.

## Example

Use case: the database is slow, and the goal is to optimize simultaneous requests for the same data

This code ensures that if a second client requests the same user data as another client still waiting for the response, both clients receive the same response object, and the database is only queried once.

```js
const mutexify = require('async-mutex-wrap')

// apply mutex to your async function (any function that returns a promise)
const mutexedLookupUser = mutexify(lookupUserAsync)

const app = async function (req, res, next) {
  const user = await mutexedLookupUser(req.params.id)
  res.json(user)
}
```

The mutex uses both the function and the params passed as mutex keys. See `mutexify.spec.js` for detailed examples.
