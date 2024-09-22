# ![](favicon.ico) The Merlin JS framework

  > A functional JS framework that values elegance, simplicity and minimalism. 

  [State Management](https://github.com/marcodpt/ring) +
  [vDom](https://github.com/jorgebucaran/superfine) +
  [Template Engine](https://github.com/marcodpt/tint) +
  [SPA Router](https://github.com/marcodpt/wand) =  ❤️

  [![bundlejs](https://deno.bundlejs.com/badge?q=https%3A%2F%2Fraw.githubusercontent.com%2Fmarcodpt%2Fmerlin%2Fmain%2Findex.js&treeshake=%5B%7Bapp%2Cspa%7D%5D)](https://bundlejs.com/?q=https%3A%2F%2Fraw.githubusercontent.com%2Fmarcodpt%2Fmerlin%2Fmain%2Findex.js&treeshake=%5B%7Bapp%2Cspa%7D%5D)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  [Demo](https://marcodpt.github.io/merlin/)

## ❤️ Features
 - No building tools.
 - Single HTML file by default.
 - Built by combining ideas from small modules following the
[UNIX philosophy](https://en.wikipedia.org/wiki/Unix_philosophy).
 - Pure functional ELM architecture state management
[library](https://github.com/marcodpt/ring).
 - Ultrafast [vDom](https://github.com/jorgebucaran/superfine).
 - Server side rendered by default
([templates](https://marcodpt.github.io/tint/syntax/intro.html) are valid html).
 - Built-in Single Page Application [Router](https://github.com/marcodpt/wand).
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
`Merlin` uses [Tint](https://github.com/marcodpt/tint) as its template engine,
you should read the [docs](https://marcodpt.github.io/tint/syntax/intro.html)
for a complete reference.

`Merlin` uses [Wand](https://github.com/marcodpt/tint) as its SPA Router,
you should read the repo for a complete reference.

### app({node, template?, view?, init, update, done?}) => stop

#### node: DOM Node 
Where to mount the `app`.

#### template: Dom Node
An optional `template` to render, if nothing is passed the `node` itself will
be used.

#### init: [state, effect?]
##### state: _
The initial state of the `app`. It can be any type of data.

##### effect: dispatch => ()
Optional function that introduces side effects.

##### dispatch: message => ()
Function that triggers an update on the state. 

#### update: (message, state) => [newState, effect?]
##### message: _
The context of the update. It can be any type of data.

##### state: _
The current state when update was called. It can be any type of data.

##### newState: _
The new state of the `app`. It can be any type of data.

#### view: (state, dispatch) => data
An optional function that formats the `state` (and eventually applies
`effects`) and is passed directly to [Tint](https://github.com/marcodpt/tint)
for rendering. If omitted, `state` will be used without modifications.

#### done: state => ()
Optional function that will be called to end the `app`.

#### stop: () => ()
Returns a function that stops the `app`.

### spa({node, routes, plugins?}) => stop

#### node: DOM Node
Where to mount the `spa`.

#### routes: {route: {template?, init?, view, update, done}}

##### route: string
Accepts `*` to match any path and `:param` to declare variable.

##### template: Dom Node
A template to be rendered on the route, if nothing is passed it will use the
original content of the `node`.

##### init: routeData => [state, effect?] 
An optional function that will be called every time the route is started,
returning the initial state. If not passed, `Params` from `routeData` will be
used as the initial `state`.

##### view, update, done
Exactly as defined in `app`

#### plugins: [routeData => ()]
An optional array of `plugins`, which are executed sequentially with each
`route` `change` and which can modify the `routeData`.

#### stop: () => ()
Returns a function that stops the `spa`.

#### routeData {url, route, path, Params, query, Query}
`Plugins` can introduce new properties or change existing ones.

##### url: string
The `url` as it was passed.

##### route: string
The `route` that matched as declared.

##### path: string
The part of the `url` before the `?`.

##### Params: object
Object containing the variables declared in the `route` with the associated
values in the current `path`.

##### query: string
The part of `url` after the `?`.

##### Query: object
Parsed query string.

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
 - [ring](https://github.com/marcodpt/ring)
 - [tint](https://github.com/marcodpt/tint)
 - [wand](https://github.com/marcodpt/wand)
 - [hyperapp](https://github.com/jorgebucaran/hyperapp)
 - [elm](https://github.com/elm)

A huge thank you to all the people who contributed to these projects.
