import {spa} from "../index.min.js"

spa({
  node: document.body.querySelector('main'),
  routes: {
    '/': {},
    '/hello/:name': {
      template: document.getElementById('view-hello')
    },
    '/counter/:start': {
      template: document.getElementById('view-counter'),
      init: ({Params}) => [parseInt(Params.start)],
      update: (message, count) => [count + (
        message == 'inc' ? 1 :
        message == 'dec' ? -1 : 0
      )],
      view: (count, dispatch) => ({
        count,
        inc: () => dispatch('inc'),
        dec: () => dispatch('dec')
      })
    },
    '*': {
      template: document.getElementById('view-404')
    }
  }
})
