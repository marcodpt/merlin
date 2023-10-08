import merlin from "../new.js"
import data from './data.js'

const counter = merlin({
  init: count => [typeof count == 'number' ? count : 0],
  inc: count => [count++],
  dec: count => [count--]
}, document.getElementById('view-counter'))

const todo = merlin({
  init: todos => [{
    value: "",
    todos: todos instanceof Array ? todos : []
  }],
  AddTodo: ({todos, value}) => [{
    todos: todos.concat(value),
    value: ''
  }],
  NewValue: ({todos, value}, ev) => [{
    todos,
    value: ev.target.value
  }]
}, document.getElementById('view-todo'))

const timer = (event, step) => {
  let intervalId
  return {
    effect (dispatch) {
      intervalId = setInterval(() => {
        dispatch(event)
      }, step)
    },
    cancel () {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }
}

const clock = merlin({
  init: () => {
    const {effect, cancel} = timer('tick', 100)
    return [{
      time: '00:00:00',
      cancel
    }, effect]
  },
  tick: () => {
    const format = n => (n < 10 ? '0' : '')+n
    const d = new Date()
    return [{
      time: format(d.getHours())+":"+
        format(d.getMinutes())+":"+
        format(d.getSeconds())
    }]
  },
  done: ({cancel}) => {
    cancel()
  }
}, document.getElementById('view-clock'))

const stopwatch = merlin(() => {
  const format = n => n.toFixed(3)
  var offset = 0
  var clock = 0
  var cancel = null
  return {
    init: () => [format(clock)],
    start: state => {
      offset = Date.now()
      if (!cancel) {
        const t = timer('tick', 100)
        cancel = t.cancel
        return [state, t.effect]
      }
    },
    tick: () => {
      console.log('tick')
      const now = Date.now()
      clock += (now - offset) / 1000
      offset = now
      return [format(clock)]
    },
    stop: () => {
      if (cancel) {
        cancel()
      }
    },
    done: state => [state, dispatch => dispatch('stop')]
  }
}, document.getElementById('view-stopwatch'))

const table = merlin({
  init: data => [{
    reverse: 1,
    sorted: 'id',
    rows: data.map((row, i) => ({
      ...row,
      id: i+1
    }))
  }, dispatch => dispatch('totals')],
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
  sort: (state, ev) => {
    const k = ev.target.getAttribute('data-sort')
    state.reverse = state.sorted == k && state.reverse == 1 ? -1 : 1
    state.sorted = k
    state.rows.sort(
      (a, b) => state.reverse * (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0)
    )
  },
  delete: (state, ev) => {
    const id = ev.target.getAttribute('data-id')
    state.rows.splice(state.rows.map((row, pos) => ({
      ...row,
      pos
    })).filter(({id}) => id == i+1)[0].pos, 1)
    return [state, dispatch => dispatch('totals')]
  }
}, document.getElementById('view-table'))

window.stop = merlin({
  init: [
    {
      root: document.body.querySelector('nav'),
      controller: ({render}) => {
        render([
          {
            href: '#/',
            label: 'Home'
          }, {
            href: '#/counter/3',
            label: 'Counter 3'
          }, {
            href: '#/todo',
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
        ])
      }
    }
  ],
  root: document.body.querySelector('main'),
  routes: [
    {}, {
      route: '#/counter/:count',
      template: document.getElementById('view-counter'),
      controller: ({Params, render}) => {
        const state = {
          count: parseInt(Params.count) || 0,
          inc: () => {
            state.count++
            render(state)
          },
          dec: () => {
            state.count--
            render(state)
          }
        }
        render(state)
      }
    }, {
      route: '#/todo',
      template: document.getElementById('view-todo'),
      controller: ({render}) => {
        const state = {
          value: "",
          todos: [],
          AddTodo: () => {
            state.todos.push(state.value)
            state.value = ""
            render(state)
          },
          NewValue: ev => {
            state.value = ev.target.value
          }
        }
        render(state)
      }
    }, {
      route: '#/clock',
      template: document.getElementById('view-clock'),
      controller: ({render}) => {
        const format = n => (n < 10 ? '0' : '')+n
        const getTime = () => {
          const d = new Date()
          return format(d.getHours())+":"+
            format(d.getMinutes())+":"+
            format(d.getSeconds())
        }

        const itv = setInterval(() => {
          console.log('tick')
          render(getTime())
        }, 100)
        render(getTime())

        return () => {
          console.log('stop')
          clearInterval(itv)
        }
      }
    }, {
      route: '#/stopwatch',
      template: document.getElementById('view-stopwatch'),
      controller: ({render}) => {
        const format = n => n.toFixed(3)
        var offset = 0
        var clock = 0
        var interval = null

        const state = {
          view: format(0),
          stop: () => {
            console.log('stop')
            interval = clearInterval(interval)
          },
          reset: () => {
            offset = Date.now()
            clock = 0
            state.view = format(0)
            render(state)
          },
          start: () => {
            offset = Date.now()
            interval = interval || setInterval(() => {
              console.log('tick')
              const now = Date.now()
              clock += (now - offset) / 1000
              offset = now
              state.view = format(clock)
              render(state)
            }, 100)
          }
        }
        render(state)

        return state.stop
      }
    }, {
      route: '#/table',
      template: document.getElementById('view-table'),
      controller: ({render}) => {
        var reverse = 1
        var sorted = 'id'
        const sort = k => () => {
          reverse = sorted == k && reverse == 1 ? -1 : 1
          sorted = k
          state.rows.sort(
            (a, b) => reverse * (a[k] < b[k] ? -1 : a[k] > b[k] ? 1 : 0)
          )
          render(state)
        }
        const totals = () => {
          state.count = state.rows.length
          state.avg_age = (
            state.rows.reduce((total, {age}) => total + age, 0) /
            (state.rows.length || 1)
          ).toFixed(0)
          state.sum_balance = state.rows.reduce((total, {
            balance
          }) => total + balance, 0).toFixed(2)
          render(state)
        }

        const state = {
          sort: 'id',
          sort_id: sort('id'),
          sort_name: sort('name'),
          sort_age: sort('age'),
          sort_balance: sort('balance'),
          count: data.length,
          rows: data.map((row, i) => ({
            ...row,
            id: i+1,
            delete: () => {
              state.rows.splice(state.rows.map((row, pos) => ({
                ...row,
                pos
              })).filter(({id}) => id == i+1)[0].pos, 1)
              totals()
            }
          }))
        }
        totals()
      }
    }, {
      route: '#/counters',
      template: document.getElementById('view-counters'),
      controller: ({render}) => {
        const state = {}
        const counter = (k, count) => {
          state[k] = {
            count: count,
            inc: () => {
              state[k].count++
              render(state)
            },
            dec: () => {
              state[k].count--
              render(state)
            }
          }
        }
        counter('first', 0)
        counter('second', 3)
        counter('third', 7)
        render(state)
      }
    }
  ]
})