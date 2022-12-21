# ![](favicon.ico) The Merlin JS framework
 - No building tools. Use a regular html file as a Single File Component.
 - Server side rendered by default
([templates](https://marcodpt.github.io/tint/) are valid html).
 - Ridiculously small API. After reading this file you will understand `Merlin`
better than me.
 - Ultrafast [vDom](https://github.com/jorgebucaran/superfine).
 - Modest approach,
can be used in the spirit of [micro-frontends](https://micro-frontends.org/),
as a template engine, for defining custom tags, or as a complete framework.

[Live Demo](https://marcodpt.github.io/merlin/)

## TODO app 
[Live Demo](https://marcodpt.github.io/merlin/samples/todo.html)

```html
<html>
  <head>
    <script type="module">
      import merlin from "https://cdn.jsdelivr.net/gh/marcodpt/merlin/index.js"

      merlin(document.getElementById('app'), update => ({
        value: "",
        todos: [],
        AddTodo: () => update(({todos, value}) => ({
          todos: todos.concat(value),
          value: ""
        })),
        NewValue: ev => update({
          value: ev.target.value
        })
      }))
    </script>
  </head>
  <body>
    <main id="app">
      <h1>To do list</h1>
      <input type="text" :value="value" :oninput="NewValue">
      <ul>
        <li :each="todos" :text></li>
      </ul>
      <button :onclick="AddTodo">New!</button>
    </main>
  </body>
</html>
```

## Counter components
[Live Demo](https://marcodpt.github.io/merlin/samples/components.html)

```html
<html>
  <head>
    <script type="module">
      import merlin from "https://cdn.jsdelivr.net/gh/marcodpt/merlin/index.js"

      document.body
        .querySelectorAll('my-counter')
        .forEach(e => merlin(e, (update, {count}) => ({
          count: isNaN(count) ? 0 : parseInt(count),
          inc: () => update(({count}) => ({
            count: count + 1
          })),
          dec: () => update(({count}) => ({
            count: count - 1
          }))
        }), document.getElementById('my-counter')))
    </script>
  </head>
  <body>
    <main>
      <my-counter></my-counter>
      <my-counter count="3"></my-counter>
      <my-counter count="7"></my-counter>
    </main>
    <template id="my-counter">
      <h1 :text="count">Counter</h1>
      <button :onclick="dec">-</button>
      <button :onclick="inc">+</button>
    </template>
  </body>
</html>
```

# API
## merlin(node, init?, template?) -> stop 
- `node`: It's the DOM element that `merlin` will be mounted on.
- `init(update, attrs) -> values`: It is an optional function that returns a
`values` object that will be merged into the `attrs` object,
this updated object is defined as the `state`.
  - `update(target)`: A function that merges the `state` object with a new one.
    - `target(state) -> values`: `target` can be a function that takes the
`state` and returns a `values` object that will be merged into `state`.
    - object `target`: `target` can be an object itself. In this case it will
be merged directly with `state`.
  - `attrs`: The object generated with the `node` attributes.
- object `init`: Alternatively, you can use `init` as an object that will be
merged directly into the `attrs` object to create the `state`.
- `template`: Is an optional DOM element with the `template` to be rendered
inside the `node`. If not present, it will use `node` as a full `template`.
In general, if you want a server-side rendered app, you'll use `node`
element alone and not pass a `template`, but if you want to reuse the
component many times on the same page you will need to pass a `template`.
- `stop() -> ()`: It is a function that is returned that stops the component,
the `update` function will no longer work and the `drop` function will be
called, if it was present in `state`.

## Template engine
Merlin uses [Tint](https://github.com/marcodpt/tint) as its template engine,
you should read the [docs](https://marcodpt.github.io/tint/) for a complete
reference.

## Contributing
It's a very simple project.
Any contribution, any feedback is greatly appreciated.
