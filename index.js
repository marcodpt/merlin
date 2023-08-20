import superfine from "https://cdn.jsdelivr.net/gh/marcodpt/tint@2.4.0/superfine.js"

const queryParser = X => ({
  ...X,
  Query: X.query.split('&')
    .map(pair => pair.split('='))
    .map(pair => ({
      key: decodeURIComponent(pair.shift()),
      value: decodeURIComponent(pair.join('='))
    }))
    .filter(({key}) => key != "")
    .reduce((Q, {key, value}) => {
      if (key.substr(key.length - 2) == '[]') {
        key = key.substr(0, key.length - 2)
        if (!(Q[key] instanceof Array)) {
          Q[key] = []
        }
        Q[key].push(value)
      } else {
        Q[key] = value
      }
      return Q
    }, {})
})

export default ({
  init,
  root,
  routes,
  middleware
}) => {
  var stop
  const goHome = root ? superfine(root) : () => {}
  middleware = [queryParser].concat(middleware)
  init = init || []
  routes = routes || []

  const Finish = init.map(({root, controller, template}) => {
    const render = superfine(root, template)
    return controller({
      render,
      root
    })
  })

  const router = () => {
    const url = window.location.hash
    const Url = url.split('?')
    const path = Url.shift()
    const query = Url.join('?')

    const Path = path.split('/').map(decodeURIComponent)

    const X = routes.reduce((match, {route, ...extra}) => {
      if (route == null && !weight) {
        return {
          ...extra,
          ...match,
          weight: 1
        }
      } else {
        const Route = route.split('/')
        if (Route.length == Path.length) {
          var weight = 2
          const Params = Path.reduce((Params, value, i) => {
            if (Params) {
              if (Route[i].substr(0, 1) == ':') {
                Params[Route[i].substr(1)] = value
              } else if (Route[i] !== value) {
                Params = null
              } else {
                weight++
              }
            }
            return Params
          }, {})
          if (Params && weight > match.weight) {
            return {
              ...extra,
              route,
              Params,
              weight,
            }
          }
        }
      }
      return match
    }, {
      route: null,
      Params: {},
      weight: 0
    })

    if (X) {
      const controller = X.controller || (({render}) => {
        if (X.template) {
          render()
        } else {
          delete root.vdom
          goHome()
        }
      })
      const render = superfine(root, X.template)
      typeof stop == 'function' && stop()
      stop = middleware.concat(options => controller({
        ...options,
        render,
        root,
        refresh: () => router(url)
      }))
        .filter(fn => typeof fn === 'function')
        .reduce((X, fn) => fn(X), {
          url,
          path,
          query,
          route: X.route,
          Params: X.Params || {}
        })
    }
  }

  window.addEventListener('hashchange', router)
  router()

  return () => {
    window.removeEventListener('hashchange', router)
    Finish.push(stop)
    Finish.filter(f => typeof f == 'function').forEach(f => f())
  }
}
