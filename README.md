# ![](favicon.ico) The Merlin JS framework

  > A functional JS framework that values elegance, simplicity and minimalism. 

  [Raj](https://github.com/andrejewski/raj) +
  [Superfine](https://github.com/jorgebucaran/superfine) +
  [Tint](https://github.com/marcodpt/tint) +
  SPA Router =  ❤️

  [![bundlejs](https://deno.bundlejs.com/badge?q=https%3A%2F%2Fraw.githubusercontent.com%2Fmarcodpt%2Fmerlin%2Fmain%2Findex.js&treeshake=%5B%7Bapp%2Cspa%7D%5D)](https://bundlejs.com/?q=https%3A%2F%2Fraw.githubusercontent.com%2Fmarcodpt%2Fmerlin%2Fmain%2Findex.js&treeshake=%5B%7Bapp%2Cspa%7D%5D)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  [Demo](https://marcodpt.github.io/merlin/)

## ❤️ Features
 - No building tools.
 - Single HTML file by default.
 - Pure functional ELM architecture state management
[library](https://jew.ski/raj/).
 - Ultrafast [vDom](https://github.com/jorgebucaran/superfine).
 - Built-in Single Page Application Router.
 - Server side rendered by default
([templates](https://marcodpt.github.io/tint/syntax/intro.html) are valid html).
 - Ridiculously small API. After reading this file you will understand `Merlin`
better than me.

## 💡 Showcase
[Demo](https://marcodpt.github.io/merlin/examples/todo.html)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Todo - The Merlin JS framework</title>
  </head>
  <body>
    <main>
      <h1>To do list</h1>
      <input type="text" value:="value" oninput:="NewValue">
      <ul>
        <li each:="todos" text:></li>
      </ul>
      <button onclick:="AddTodo">New!</button>
    </main>
    <script type="module">
      import {app} from "https://cdn.jsdelivr.net/gh/marcodpt/merlin/index.min.js"

      app({
        node: document.body.querySelector('main'),
        init: [{
          value: "",
          todos: []
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
      })
    </script>
  </body>
</html>
```

## 💯 Examples
 - Counter:
[Demo](https://marcodpt.github.io/merlin/examples/counter.html)
[Source](https://github.com/marcodpt/merlin/blob/main/examples/counter.html)
 - Todo SSR:
[Demo](https://marcodpt.github.io/merlin/examples/todo_ssr.html)
[Source](https://github.com/marcodpt/merlin/blob/main/examples/todo_ssr.html)
 - Clock:
[Demo](https://marcodpt.github.io/merlin/examples/clock.html)
[Source](https://github.com/marcodpt/merlin/blob/main/examples/clock.html)
 - Stopwatch:
[Demo](https://marcodpt.github.io/merlin/examples/stopwatch.html)
[Source](https://github.com/marcodpt/merlin/blob/main/examples/stopwatch.html)
 - Table:
[Demo](https://marcodpt.github.io/merlin/examples/table.html)
[Source](https://github.com/marcodpt/merlin/blob/main/examples/table.html)
 - Components:
[Demo](https://marcodpt.github.io/merlin/examples/components.html)
[Source](https://github.com/marcodpt/merlin/blob/main/examples/components.html)
 - SPA Router:
[Demo](https://marcodpt.github.io/merlin/examples/spa.html)
[HTML](https://github.com/marcodpt/merlin/blob/main/examples/spa.html)
[JS](https://github.com/marcodpt/merlin/blob/main/examples/spa.js)

## 📖 API

`Merlin` uses [Raj](https://github.com/andrejewski/raj) as its state management
library, you should read the
[docs](https://github.com/andrejewski/raj-by-example) for a complete reference.

`Merlin` uses [Tint](https://github.com/marcodpt/tint) as its template engine,
you should read the [docs](https://marcodpt.github.io/tint/syntax/intro.html)
for a complete reference.

### app({node, template?, view?, init, update, done?}) => stop
 - `node` **DOM Node**:
Where to mount the `app`.
 - `template` **Dom Node**:
An optional `template` to render, if nothing is passed the `node` itself will
be used.
 - `init` **[state, effect?]**:
Exactly as defined in [Raj](https://github.com/andrejewski/raj).
   - `state`:
The initial state of the `app`. It can be any type of data.
   - `effect` **(dispatch) => ()**:
Optional function that introduces side effects.
     - `dispatch` **(message) => ()**:
Function that triggers an update on the state. 
 - `update` **(message, state) => [newState, effect?]**:
Exactly as defined in [Raj](https://github.com/andrejewski/raj).
   - `message`:
The context of the update. It can be any type of data.
   - `state`:
The current state when update was called. It can be any type of data.
   - `newState`:
The new state of the `app`. It can be any type of data.
 - `view` **(state, dispatch) => data**:
An optional function that formats the `state` (and eventually applies
`effects`) and is passed directly to [Tint](https://github.com/marcodpt/tint)
for rendering. If omitted, `state` will be used without modifications.
 - `done` **state => ()**:
Exactly as defined in [Raj](https://github.com/andrejewski/raj).
Optional function that will be called to end the `app`.
 - `stop` **() => ()**:
Returns a function that stops the `app`.

### spa({node, routes, plugins?}) => stop
 - `node` **DOM Node**:
Where to mount the `spa`.
 - `routes` **{route: {template?, init?, view, update, done}}**:
   - `route` **string**:
Accepts `*` to match any path and `:param` to declare variable.
   - `template` **Dom Node**: 
A template to be rendered on the route, if nothing is passed it will use the
original content of the `node`.
   - `init` **routeData => [state, effect?]**: 
An optional function that will be called every time the route is started,
returning the initial state. If not passed, `Params` from `routeData` will be
used as the initial `state`.
   - `view`, `update`, `done`: Exactly as defined in `app`
 - `plugins` **[routeData => {...newData, ...routeData}]**:
An optional array of plugins, which are executed sequentially with each route
change and must return a object whose properties will be attached to
`routeData`.
 - `stop` **() => ()**:
Returns a function that stops the `spa`.

#### routeData {url, route, path, Params, query, Query, old, ...newData}
 - `url` **string**: 
The `url` as it was passed.
 - `route` **string**:
The `route` that matched as declared.
 - `path` **string**:
The part of the `url` before the `?`.
 - `Params` **Object**: 
Object containing the variables declared in the `route` with the associated
values in the current `path`.
 - `query` **string**:
The part of `url` after the `?`.
 - `Query` **Object**:
Parsed query string.
 - `old` **{url, route, path, Params, query}**:
Previous `routeData` or `null`.
 - `newData`
New properties introduced by plugins.

## 🤝 Contributing
It's a very simple project.
Any contribution, any feedback is greatly appreciated.

## ⭐ Support
If this project was useful to you, consider giving it a star on github, it's a
way to increase evidence and attract more contributors.

## 🙏 Acknowledgment
This work is hugely influenced by these amazing projects:
 - [superfine](https://github.com/jorgebucaran/superfine)
 - [raj](https://github.com/andrejewski/raj)
 - [tint](https://github.com/marcodpt/tint)
 - [hyperapp](https://github.com/jorgebucaran/hyperapp)
 - [elm](https://github.com/elm)

A huge thank you to all the people who contributed to these projects.
