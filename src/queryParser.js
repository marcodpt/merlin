export default state => ({
  Query: (state.query || '').split('&')
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
