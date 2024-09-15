import app from './app.js'
import router from './router.js'
import queryParser from './queryParser.js'

export default ({node, routes, plugins}) => {
  const home = node.cloneNode(true)
  
  const run = router(Object.keys(routes).reduce((R, k) => ({
    ...R,
    [k]: state => {
      return app({
        node,
        template: home,
        view: state => state,
        ...routes[k],
        init: (routes[k].init || (({Params}) => [Params]))(state)
      })
    }
  }), routes || {}), [queryParser].concat(plugins || []))

  const change = () => {
    run((window.location.hash || '#/').substr(1))
  }

  window.addEventListener('hashchange', change)
  change()
}
