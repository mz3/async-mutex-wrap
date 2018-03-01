# async-mutex-wrap

Usage:

```js
// the library
const mutexify = require('./mutexify')

// your async function
const lookupUserAsync = function (id) { ... }

// a mutexed version that will prevent and group parallel calls
const lookupUser = mutexify(lookupUserAsync)

const app = async function (req, res) {
  const user = await lookupUser(req.params.id)
  res.json(user)
}
```

See `mutexify.spec.js` for more examples.
