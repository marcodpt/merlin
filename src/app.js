import superfine from 'https://cdn.jsdelivr.net/gh/marcodpt/tint@2.5.0/superfine.js'
import ring from 'https://cdn.jsdelivr.net/gh/marcodpt/ring@0.2.1/index.js'

export default ({node, template, view, ...runtime}) => {
  const render = superfine(node, template)

  return ring({
    ...runtime,
    view: (state, events) => {render(view ? view(state, events) : state)}
  })
}
