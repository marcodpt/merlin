import {spa} from "../index.min.js"

window.stop = spa({
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
    '/todo': {
      template: document.getElementById('view-todo'),
      init: ({Query}) => [{
        value: "",
        todos: Query.todos instanceof Array ? Query.todos : []
      }],
      update: (todo, state) => {
        if (todo != null) {
          state.value = todo
        } else if (state.value) {
          state.todos.push(state.value)
          state.value = ""
        }
      
        return [state]
      },
      view: (state, dispatch) => ({
        ...state,
        AddTodo: () => dispatch(),
        NewValue: ev => dispatch(ev.target.value)
      })
    },
    '/clock': {
      template: document.getElementById('view-clock'),
      init: () => [null, dispatch => {dispatch()}],
      update: () => [new Date(), dispatch => {
        setTimeout(dispatch, 100)
      }],
      view: time => {
        console.log('tick')
        const format = n => (n < 10 ? '0' : '')+n
        return !time ? '00:00:00' : format(time.getHours())+":"+
          format(time.getMinutes())+":"+
          format(time.getSeconds())
      }
    },
    '*': {
      template: document.getElementById('view-404')
    }
  }
})
