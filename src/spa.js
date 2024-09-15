import app from './app.js'
import router from './router.js'
import queryParser from './queryParser.js'

export default ({node, routes, plugins}) => {
  const home = node.cloneNode(true)
  
  var run = router(Object.keys(routes).reduce((R, k) => ({
    ...R,
    [k]: state => app({
      template: home,
      ...routes[k],
      node,
      init: (routes[k].init || (({Params}) => [Params]))(state)
    })
  }), routes || {}), [queryParser].concat(plugins || []))
  var stop = () => {}

  const change = () => {
    if (typeof run == 'function') {
      stop = run((window.location.hash || '#/').substr(1))
    }
  }

  window.addEventListener('hashchange', change)
  change()
  return () => {
    run = false
    window.removeEventListener('hashchange', change)
    stop()
  }
}
