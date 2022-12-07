import merlin from './index.js'

merlin({
  home: 'app',
  rejected: 'rejected',
  pending: 'pending',
  routes: {
    '/': {
      view: 'app'
    },
    '/counter/:start': {
      view: 'counter',
      init: ({start}) => ({
        count: parseInt(start)
      }),
      update: ({}) => ({

      }),
      actions: (state) => ({
        inc: () => {state.count++},
        dec: () => {state.count--}
      })
    },
    '/todo': {
      view: 'todo',
      init: ({query}) => ({
        value: query.value || '',
        todos: []
      })
    }
  }

  routes: [
    {
      path: '/',
      view: '',
      ctrl: render => {
        const update = render('', app)
      }
    }, {
      path: '/todo',
      ctrl: (render, )

      view: 'view-todo',
      init: () => ({
        value: '',
        todos: []
      }),
      actions: {
        AddTodo: ({value, todos}) => ({
          value: '',
          todos: todos.concat(value)
        }),
        NewValue: (state, event) => ({
          ...state,
          value: event.target.value
        })
      }
    }, {
      path: '/counter/:start',
      view: 'view-counter',
      init: ({params}) => parseInt(params.start),
      actions: {
        inc: state => state++,
        dec: state => state--
      }
    }
  ]

  routes: {
    '/': render => render('app'),
    '/counter': render => {
      const state = {
        count: 0,
        inc: () => {
          state.count++
          view()
        },
        dec: () => {
          state.count--
          view()
        }
      }
      const view = () => render('counter', state)
      view()
    },
    '/todo': render => {
      const state = {
        todos: [],
        value: "",
        addTodo: () => {
          state.todos.push(state.value)
          state.value = ""
          render('view-todo', state)
        }
      }

    },
    '/library': render => {

    },
    '/split': render => {

    },
    '*': render => {
      render('view-not-found')
    }
  }
})
