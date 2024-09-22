import superfine from 'https://cdn.jsdelivr.net/gh/marcodpt/tint@2.5.0/superfine.js'
import ring from 'https://cdn.jsdelivr.net/gh/marcodpt/ring@0.1.0/index.js'

export default ({node, template, view, ...runtime}) => {
  const render = superfine(node, template)

  return ring({
    ...runtime,
    view: (state, dispatch) => {render(view ? view(state, dispatch) : state)}
  })
}
