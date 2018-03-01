# async-mutex-wrap

Example usage:
Prevent unnecessary database calls for the same data

```js
const mutexify = require('./mutexify')
const lookupUserAsync = function (id) { ... }
const lookupUser = mutexify(lookupUserAsync)

const app = async function (req, res) {
  const user = await lookupUser(req.params.id)
  res.json(user)
}
```

See `mutexify.spec.js` for more examples.
