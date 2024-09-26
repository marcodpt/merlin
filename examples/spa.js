import {spa} from "../index.js"

window.stop = spa({
  node: document.body.querySelector('main'),
  routes: {
    '/': {},
    '/hello/:name': {
      template: document.getElementById('view-hello')
    },
    '/counter/:start': {
      template: document.getElementById('view-counter'),
      init: ({Params}) => parseInt(Params.start),
      register: update => ({
        inc: () => update(count => count + 1),
        dec: () => update(count => count - 1)
      }),
      view: (count, events) => ({
        count,
        ...events
      })
    },
    '/todo': {
      template: document.getElementById('view-todo'),
      init: ({Query}) => ({
        value: "",
        todos: Query.todos instanceof Array ? Query.todos : []
      }),
      register: update => ({
        NewValue: ev => update(state => ({
          ...state,
          value: ev.target.value
        })),
        AddTodo: () => update(({todos, value}) => ({
          todos: todos.concat(value),
          value: ''
        }))
      }),
      view: (state, events) => ({
        ...state,
        ...events
      })
    },
    '/clock': {
      template: document.getElementById('view-clock'),
      init: () => null,
      register: (update, dispatch) => ({
        init: () => {
          update(() => new Date())
          setTimeout(() => {dispatch('init')}, 100)
        }
      }),
      view: time => {
        console.log('tick')
        return !time ? '00:00:00' : [
          time.getHours(),
          time.getMinutes(),
          time.getSeconds()
        ].map(n => (n < 10 ? '0' : '')+n).join(':')
      }
    },
    '*': {
      template: document.getElementById('view-404')
    }
  }
})
