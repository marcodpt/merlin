import tint from "https://cdn.jsdelivr.net/gh/marcodpt/tint@2.5.0/index.js"
import {h, text, patch} from "https://unpkg.com/superfine"

export default (events, template) => (node, init) => {
  var state
  var isRunning = false

  const dispatch = (message, data) => {
    if (isRunning == (message != 'init') && events[message]) {
      isRunning = true
      const [newState, effect] = events[message](
        message == 'init' ? data : state, data
      ) || [state]
      state = newState
      patch(node, render(state))
      if (effect) {
        effect(dispatch)
      }
      if (message == 'done') {
        isRunning = false
      }
    }
  }

  const render = tint((el, attrs, children) => {
    Object.keys(attrs || {}).forEach(k => {
      if (attrs.substr(0, 2) == 'on') {
        attrs[k] = ev => dispatch(attrs[k], ev)
      }
    })
    return h(el, attrs, children)
  }, text)(node, template)

  dispatch('init', init)
  return dispatch
}
