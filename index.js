import superfine from "https://cdn.jsdelivr.net/gh/marcodpt/tint@2.5.0/superfine.js"
import raj from './raj.js'

export default ({node, template, view, ...runtime}) => {
  const render = superfine(node, template)

  return raj({
    ...runtime,
    view: (state, dispatch) => {render(view(state, dispatch))}
  })
}
