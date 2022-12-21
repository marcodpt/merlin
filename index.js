import tint from 'https://cdn.jsdelivr.net/gh/marcodpt/tint/superfine.js'

export default (node, init, template) => {
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

  const attrs = Array.from(node.attributes).reduce((attrs, {
    nodeName,
    nodeValue
  }) => ({
    ...attrs,
    [nodeName]: nodeValue
  }), {})

  if (typeof init == 'function') {
    update(init(update, attrs))
  } else {
    update(init && typeof init == 'object' ? init : attrs)
  } 

  return () => {
    if (!stop && typeof state.drop == 'function') {
      state.drop(state)
    }
    stop = true
  }
}
