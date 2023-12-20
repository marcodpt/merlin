import tint from "https://cdn.jsdelivr.net/gh/marcodpt/tint@2.5.0/index.js"
import {
  h, text, patch
} from "https://cdn.jsdelivr.net/gh/jorgebucaran/superfine@8.2.0/index.js"

const component = ({
  root,
  template,
  format,
  ...events
}) => {
  var state
  var isRunning = false
  format = typeof format == 'function' ? format : (state => state)
  events.init = typeof events.init == 'function' ? events.init : (data => data)
  events.done = typeof events.done == 'function' ? events.done : (() => null)

  const call = (message, data) => {
    if ((message == 'init' && !isRunning) || (
      message != 'init' &&
      isRunning &&
      typeof events[message] == 'function'
    )) {
      isRunning = true
      const newState = message == 'init' ? events.init(data, call) :
        message == 'done' ? events.done(state, call) :
          events[message](state, data, call)
      state = newState === undefined ? state : newState
      if (message == 'done') {
        isRunning = false
      } else {
        patch(root, render(format(state)))
      }
    }
  }

  const render = tint((tag, attrs, children) => {
    Object.keys(attrs || {}).forEach(k => {
      if (k.substr(0, 7) == 'data-on') {
        k = k.substr(5)
      }
      const name = attrs[k] || attrs['data-'+k]
      if (k.substr(0, 2) == 'on') {
        attrs[k] = typeof events[name] == 'function' ? ev => {
          call(name, ev)
        } : (window[name] || (() => {}))
      }
    })
    return h(tag, attrs, children)
  }, text)(root, template)

  return call
}

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
  root,
  components,
  routes,
  middleware,
  ...userData
}) => {
  root = root || document.body.querySelector('main') || document.body
  routes = routes instanceof Array ? routes : []
  middleware = [queryParser].concat(middleware)
    .filter(fn => typeof fn === 'function')
  components = components && typeof components == 'object' ? components : {}

  const home = document.createElement('template') 
  if (routes.length) {
    Array.from(root.children).forEach(child => {
      home.content.appendChild(child.cloneNode(true))
    })
    components.home = {template: home}
  }
  
  const names = Object.keys(components)
  const Views = {}
  const extra = {
    config: Object.keys(userData).reduce((config, name) => {
      if (names.indexOf(name) < 0) {
        config[name] = userData[name]
      }
      return config
    }, {}),
    root,
    refresh: () => router()
  }
  const Handlers = names.reduce((H, name) => {
    const C = components[name]
    if (C.root == null) {
      C.root = root
    }
    if (C.root == root && routes.length && C.template == null) {
      C.template = home
    }
    const B = component(C)
    H.push(B)
    if (C.root != root || !routes.length) {
      B('init', {
        api: userData[name],
        ...extra
      })
    } else {
      Views[name] = B
    }
    return H
  }, [])
  var handler = Views.home

  const router = () => {
    const url = window.location.hash
    const Url = url.split('?')
    const path = Url.shift()
    const query = Url.join('?')

    const Path = path.split('/').map(decodeURIComponent)

    const X = routes.reduce((match, {route, ...extra}) => {
      if (route == null) {
        if (!match.weight) {
          return {
            ...extra,
            ...match,
            weight: 1
          }
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
      handler('done')
      handler = Views[X.component] || Views.home
      const copy = X => JSON.parse(JSON.stringify(X))
      const base = {
        url,
        path,
        query,
        route: X.route,
        Params: X.Params || {}
      }
      const state = {
        ...middleware.reduce((X, fn) => fn(X), copy(base)),
        ...base
      }
      Handlers.forEach(handler => handler('hashchange', copy(state)))
      handler('init', {
        ...state,
        api: userData[X.component],
        ...extra
      })
    }
  }

  if (routes.length) {
    window.addEventListener('hashchange', router)
    router()
  }

  return () => {
    if (routes.length) {
      window.removeEventListener('hashchange', router)
    }
    Handlers.forEach(handler => handler('done'))
  }
}
