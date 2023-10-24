import merlin from "../index.min.js"
import data from './data.js'

window.stop = merlin({
  components: {
    nav: {
      root: document.body.querySelector('nav'),
    },
    notFound: {
      template: document.getElementById('view-notfound')
    },
    counter: {
      template: document.getElementById('view-counter'),
      init: ({Params}) => !isNaN(Params.count) ? parseInt(Params.count) : 0,
      inc: count => count+1,
      dec: count => count-1
    },
    counters: {
      template: document.getElementById('view-counters'),
      init: () => [0, 3, 7].map((v, i) => ({key: i, value: v})),
      inc: (state, ev) => {state[ev.target.getAttribute('data-key')].value++},
      dec: (state, ev) => {state[ev.target.getAttribute('data-key')].value--},
    },
    todo: {
      template: document.getElementById('view-todo'),
      init: ({Query}) => ({
        value: "",
        todos: Query.todos instanceof Array ? Query.todos : []
      }),
      AddTodo: ({todos, value}) => ({
        todos: todos.concat(value),
        value: ''
      }),
      NewValue: ({todos, value}, ev) => ({
        todos,
        value: ev.target.value
      })
    },
    clock: {
      template: document.getElementById('view-clock'),
      format: ({time}) => {
        const format = n => (n < 10 ? '0' : '')+n
        return !time ? '' : format(time.getHours())+":"+
          format(time.getMinutes())+":"+
          format(time.getSeconds())
      },
      init: (_, call) => ({
        intervalId: setInterval(() => {
          call('tick')
        }, 100)
      }),
      tick: state => {
        console.log('tick')
        state.time = new Date()
      },
      done: ({intervalId}) => {
        if (intervalId) {
          clearInterval(intervalId)
        }
      }
    },
    stopwatch: {
      template: document.getElementById('view-stopwatch'),
      format: ({clock}) => clock.toFixed(3),
      init: () => ({
        clock: 0,
        offset: 0,
        intervalId: null
      }),
      reset: state => {
        state.clock = 0
      },
      start: (state, _, call) => {
        state.offset = Date.now()
        if (!state.intervalId) {
          state.intervalId = setInterval(() => {
            call('tick')
          }, 100)
        }
      },
      tick: state => {
        console.log('tick')
        const now = Date.now()
        state.clock += (now - state.offset) / 1000
        state.offset = now
      },
      stop: state => {
        if (state.intervalId) {
          clearInterval(state.intervalId)
          state.intervalId = null
        }
      },
      done: (_state, _data, call) => call('stop')
    }, 
    table: {
      template: document.getElementById('view-table'),
      set: (_, state) => state,
      init: ({data}, call) => {
        call('set', {
          data: JSON.parse(JSON.stringify(data)),
          reverse: 1,
          sorted: 'id',
          rows: data.map((row, i) => ({
            ...row,
            id: i+1
          }))
        })
        call('totals')
      },
      totals: state => {
        state.count = state.rows.length
        state.avg_age = (
          state.rows.reduce((total, {age}) => total + age, 0) /
          (state.rows.length || 1)
        ).toFixed(0)
        state.sum_balance = state.rows.reduce((total, {
          balance
        }) => total + balance, 0).toFixed(2)
      },
      sort: (state, k) => {
        state.reverse = state.sorted == k && state.reverse == 1 ? -1 : 1
        state.sorted = k
        state.rows.sort(
          (a, b) => state.reverse * (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0)
        )
      },
      sort_id: (_state, _data, call) => call('sort', 'id'),
      sort_name: (_state, _data, call) => call('sort', 'name'),
      sort_age: (_state, _data, call) => call('sort', 'age'),
      sort_balance: (_state, _data, call) => call('sort', 'balance'),
      delete: (state, ev, call) => {
        const id = ev.target.getAttribute('data-id')
        state.rows.splice(state.rows.map((row, pos) => ({
          ...row,
          pos
        })).filter(row => row.id == id)[0].pos, 1)
        call('totals')
      }
    }
  },
  nav: [
    {
      href: '#/',
      label: 'Home'
    }, {
      href: '#/counter/3',
      label: 'Counter 3'
    }, {
      href: '#/todo?todos[]=read%20a%20book&todos[]=plant%20a%20tree',
      label: 'Todo'
    }, {
      href: '#/clock',
      label: 'Clock'
    }, {
      href: '#/stopwatch',
      label: 'Stopwatch'
    }, {
      href: '#/table',
      label: 'Table'
    }, {
      href: '#/counters',
      label: 'Components'
    }, {
      href: 'javascript:stop()',
      label: 'Stop router'
    }
  ],
  routes: [
    {
      route: ''
    }, {
      route: '#/'
    }, {
      route: '#/counter/:count',
      component: 'counter'
    }, {
      route: '#/todo',
      component: 'todo'
    }, {
      route: '#/clock',
      component: 'clock'
    }, {
      route: '#/stopwatch',
      component: 'stopwatch'
    }, {
      route: '#/table',
      component: 'table'
    }, {
      route: '#/counters',
      component: 'counters'
    }, {
      component: 'notFound' 
    }
  ],
  table: data
})
