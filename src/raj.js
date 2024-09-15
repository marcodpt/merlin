export default ({init, update, view, done}) => {
  var state
  var isRunning = true

  const dispatch = message => {
    if (isRunning) {
      change(update(message, state))
    }
  }

  const change = ([newState, effect]) => {
    state = newState
    if (effect) {
      effect(dispatch)
    }
    view(state, dispatch)
  }

  change(init)

  return () => {
    if (isRunning) {
      isRunning = false
      if (done) {
        done(state)
      }
    }
  }
}
