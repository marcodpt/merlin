# ![](favicon.ico) The Merlin JS framework
 - No building tools. Use a regular html file as a Single File Component.
 - Server side rendered by default
([templates](https://marcodpt.github.io/tint/syntax/intro.html) are valid html).
 - Ridiculously small API. After reading this file you will understand `Merlin`
better than me.
 - Ultrafast [vDom](https://github.com/jorgebucaran/superfine).
 - Built-in Single Page Application Router.

[Live Demo](https://marcodpt.github.io/merlin/)

## TODO app 
[Live Demo](https://marcodpt.github.io/merlin/samples/todo.html)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Todo - The Merlin JS framework</title>
  </head>
  <body>
    <main>
      <h1>To do list</h1>
      <input type="text" value:="value" data-oninput="NewValue">
      <ul>
        <li each:="todos" text:></li>
      </ul>
      <button data-onclick="AddTodo">New!</button>
    </main>
    <script type="module">
      import merlin from "https://cdn.jsdelivr.net/gh/marcodpt/merlin/index.js"

      merlin({
        components: {
          todo: {
            root: document.body.querySelector('main'),
            init: () => ({
              value: "",
              todos: []
            }),
            AddTodo: ({todos, value}) => ({
              todos: todos.concat(value),
              value: ''
            }),
            NewValue: ({todos, value}, ev) => ({
              todos,
              value: ev.target.value
            })
          }
        }
      })
    </script>
  </body>
</html>
```

If you are using a template, you can write directly:

```html
<template id="my-view">
  <main>
    <h1>To do list</h1>
    <input type="text" value:="value" oninput="NewValue">
    <ul>
      <li each:="todos" text:></li>
    </ul>
    <button onclick="AddTodo">New!</button>
  </main>
<template>
```

Every `on{event}` or `data-on{event}` attribute will be treated as a string and
converted to the component's associated function.

If you are not using a `template` and the element is already SSR in the DOM you
MUST use `data-on{event}` because there is no global function `NewValue` or
`AddTodo` and it will result in errors.

# API
## merlin({components, root, routes, middleware, ...userData}) -> stop

### components: {name: {root, template, init, format, done, ...methods}}
Object containing all components of your app:

 - `root`: the optional root DOM element where the component should be mounted. Components without root are views in the routing system. Components with root are permanent elements like navbars, footers.
 - `template`: the optional template DOM element used to mount the component. In general you will use templates associated with views in the routing system, and ingore it in permanent elements. But there are exceptions that will be covered.
 - fn `init`(`data`, `call`) -> `state`: is an optional function that is always called in the startup of the component and returns the initial `state`. If `init` is not passed wherever been in `data` will be the initial `state`. 
 - fn `format`(`state`) -> `viewState`: is an optional function that transform the state for view rendering. Is useful when the state should store data that belongs to internal component logic and/or the same data formatting should be aplied before rendering. If `format` is not passed the `state` will be used directly to render the view.
 - fn `done`(`state`, `data`, `call`) -> (): is an optional function that is always called when the component should be stopped, like when the route has changed. If it is not passed a function that do nothing is used instead.
 - fn `method`(`state`, `data`, `call`) -> `newState`: All remaining properties of the `component` object are `methods` avaiable to be called by the user using `on{event}` or `data-on{event}` on the associated `template` or DOM element or to be called internally by other `method` or `init` or `done` via the use of `call` function.

### root: DOM Element
The DOM Element that the component should mount.
In the case of the `init` property, each entry has its own `root`.
In the case of the `root` property, it will be used in all routes from the
`routes` property.

### template: DOM Element
An optional DOM Element that must be passed with the element's view to be
mounted on `root`.
If not passed, `root` itself will be used as view.

### routes: [{route, template, controller}]
Array of routes for routing following the page `hash`.
If not passed, the default value is an empty array.
If `route` is not passed, the route will be called if no match happens.
If `template` is not passed, `root` will be used.
If `controller` is not passed a simple rendering will be done.

### route: string
Hash path of the route in question.
If you do not pass the `route` property, the route will be called if there is
no match.
You can declare parameters in routes, for example:
```js
{
  route: '#/counter/:count'
}
```

### middleware: [({url, path, query, route, Params, Query}) -> {...}]
Array of functions that add parameters associated with the page hash.
It should always return an object with new parameters.
If not passed, the default value is an empty array.
For example, if you declared the route:
```js
{
  route: '#/counter/:count'
}
```
And we have the hash of the page at that moment equal to:
```
#/counter/7?x=13&y=bird
```
We have:
```js
{
  url: '#/counter/7?x=13&y=bird',
  path: '#/counter/7',
  query: 'x=13&y=bird',
  route: '#/counter/:count',
  Params: {
    count: '7'
  },
  Query: {
    x: '13',
    y: 'bird'
  }
}
```
New properties can be added to be passed to all `controllers` using your owns
`middlewares`.

### controller: ({...middleware, root, refresh}) -> stop
Function that controls the component.
The properties generated by the `middlewares` are only available on the
`routes` property.
The `init` property your `controllers` will only have available:
`root`, `render`.

### refresh: () -> ()
Reinitializes the route by calling `controller` with the same parameters as
the current call.
          
### stop: () -> ()
Function that when called stops the component.

## Template engine
Merlin uses [Tint](https://github.com/marcodpt/tint) as its template engine,
you should read the [docs](https://marcodpt.github.io/tint/syntax/intro.html)
for a complete reference.

## Bundle
The `index.min.js` file is a minified and bundled version of `index.js` built
online with [bundle.js](https://bundlejs.com/).

## Contributing
It's a very simple project.
Any contribution, any feedback is greatly appreciated.

## Acknowledgment
This work is hugely influenced by these amazing projects:
 - [superfine](https://github.com/jorgebucaran/superfine)
 - [raj](https://github.com/andrejewski/raj)
 - [tint](https://github.com/marcodpt/tint)
 - [hyperapp](https://github.com/jorgebucaran/hyperapp)
 - [elm](https://github.com/elm)

A huge thank you to all the people who contributed to these projects.
