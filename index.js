import tint from 'https://cdn.jsdelivr.net/gh/marcodpt/tint/superfine.js'

export default ({
  template,
  init,
  drop
}) => (node, params) => {
  const patch = tint(node, template)
  var stop = false
  const state = {}
  const merge = x => {
    if (x && typeof x == 'object') {
      Object.keys(x).forEach(k => {
        state[k] = x[k]
      })
    }
  }
  const update = callback => {
    if (!stop) {
      if (typeof callback == 'function') {
        merge(callback(state))
      } else {
        merge(callback)
      }
      patch(state)
    }
  }

  if (typeof init == 'function') {
    update(init(update, params))
  } else {
    update()
  } 

  return () => {
    if (!stop && typeof drop == 'function') {
      drop(state)
    }
    stop = true
  }
}
