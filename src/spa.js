import app from './app.js'
import {hashRouter} from "https://cdn.jsdelivr.net/gh/marcodpt/wand@0.1.0/index.js"

export default ({node, routes, register, ...config}) => {
  const home = node.cloneNode(true)
  
  return hashRouter({
    routes: Object.keys(routes).reduce((R, k) => ({
      ...R,
      [k]: state => app({
        template: home,
        register: () => ({}),
        ...routes[k],
        node,
        init: (routes[k].init || (({Params}) => Params))(state)
      })
    }), routes || {}),
    ...config
  })
}
