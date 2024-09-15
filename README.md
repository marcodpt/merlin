# ![](docs/favicon.ico) The Merlin JS framework
  [Raj](https://github.com/andrejewski/raj) +
  [Superfine](https://github.com/jorgebucaran/superfine) +
  [Tint](https://github.com/marcodpt/tint) +
  SPA Router =  ❤️

  [![bundlejs](https://deno.bundlejs.com/badge?q=https://raw.githubusercontent.com/marcodpt/merlin/main/index.js&treeshake=[*]&text=%22export+merlin%22)](https://bundlejs.com/?q=https://raw.githubusercontent.com/marcodpt/merlin/main/index.js&treeshake=[*]&text=%22export+merlin%22)
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

## 🎮 Showcase
[Demo](https://marcodpt.github.io/merlin/todo.html)

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

## 💻 Examples
 - Counter:
[Demo](https://marcodpt.github.io/merlin/counter.html)
[Source](https://github.com/marcodpt/merlin/blob/main/docs/counter.html)
 - Todo SSR:
[Demo](https://marcodpt.github.io/merlin/todo_ssr.html)
[Source](https://github.com/marcodpt/merlin/blob/main/docs/todo_ssr.html)
 - Clock:
[Demo](https://marcodpt.github.io/merlin/clock.html)
[Source](https://github.com/marcodpt/merlin/blob/main/docs/clock.html)
 - Stopwatch:
[Demo](https://marcodpt.github.io/merlin/stopwatch.html)
[Source](https://github.com/marcodpt/merlin/blob/main/docs/stopwatch.html)
 - Table:
[Demo](https://marcodpt.github.io/merlin/table.html)
[Source](https://github.com/marcodpt/merlin/blob/main/docs/table.html)
 - Components:
[Demo](https://marcodpt.github.io/merlin/components.html)
[Source](https://github.com/marcodpt/merlin/blob/main/docs/components.html)
 - SPA Router:
[Demo](https://marcodpt.github.io/merlin/spa.html)
[HTML](https://github.com/marcodpt/merlin/blob/main/docs/spa.html)
[JS](https://github.com/marcodpt/merlin/blob/main/docs/spa.js)

## 📖 API

`Merlin` uses [Raj](https://github.com/andrejewski/raj) as its state management
library, you should read the
[docs](https://github.com/andrejewski/raj-by-example) for a complete reference.

`Merlin` uses [Tint](https://github.com/marcodpt/tint) as its template engine,
you should read the [docs](https://marcodpt.github.io/tint/syntax/intro.html)
for a complete reference.

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
