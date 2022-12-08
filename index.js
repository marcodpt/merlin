import tint from 'https://cdn.jsdelivr.net/gh/marcodpt/tint/superfine.js'

export default ({
  node,
  data,
  actions
}) => {
  const state = typeof data == 'function' ? data() : data
  const patch = tint(node)
  const render = () => patch(state)
  if (actions && (state != null && typeof state == 'object')) {
    const f = actions(state, render)
    Object.keys(f).forEach(key => {
      state[key] = function () {
        const res = f[key].apply(null, arguments)
        render()
        return res
      }
    })
  }
  render()
}
