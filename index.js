import {patch, h, text, router, tint} from './dependencies.js'

const compile = tint(h, text)

export default ({
  home,
  rejected,
  pending,
  routes
}) => {
  const node = document.getElementById(home)
  const render = compile(node)
  Object.keys(routes).forEach(path => {
    const {view, init, update, actions} = routes[path]
    var state = null
    const setView = () => {
      patch(node, render(view, state))
    }
    router(path, ({params, query}) => Promise.resolve()
      .then(() => init(params, query))
      .then(res => {
        state = res
        return actions(state, setView)
      })
      .then(res => {
        Object.keys(res).forEach(key => {
          state[key] = () => {
            res[key].apply(null, arguments)
            setView()
          }
        })
        setView()
      })
    )
  })
}
