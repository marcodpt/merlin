import tint from 'https://cdn.jsdelivr.net/gh/marcodpt/tint/superfine.js'

export default ({
  node,
  data,
  init,
  drop
}) => {
  const patch = tint(node)
  var stop = false
  const render = () => !stop && patch(data)
  render()
  if (typeof init == 'function' && (data && typeof data == 'object')) {
    const f = init(data, render)
    if (f && typeof f == 'object') {
      Object.keys(f).forEach(key => {
        data[key] = typeof f[key] == 'function' ? function () {
          if (!stop) {
            const res = f[key].apply(null, arguments)
            render()
            return res
          }
        } : f[key]
      })
      render()
    }
  }
  return () => {
    if (!stop) {
      if (typeof drop == 'function') {
        const res = drop(data)
        stop = true
        return res
      }
      stop = true
    }
  }
}
