# ![](docs/favicon.ico) The Merlin JS framework
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
Object containing all components of your application:

 - `root`: The optional root DOM element where the component should be mounted.
 Rootless components are views in the routing system. Rooted components are
 permanent elements like navigation bars and footers.
 - `template`: The optional template DOM element used to assemble the
component. In general, you will use templates associated with views in the
routing system and will not use templates on permanent elements. But there are
exceptions that will be addressed.
 - fn `init`(`data`, `call`) -> `state`: An optional function that is always
called at component initialization and returns the initial `state`. If `init`
is not passed whatever is in `data` will be the initial `state`.
 - fn `format`(`state`) -> `viewState`: An optional function that transforms
the state for rendering the view. It is useful when the state must store data
that belongs to the component's internal logic and/or data formatting must be
applied before rendering. If `format` is not passed, `state` will be used
directly to render the view.
 - fn `done`(`state`, `call`) -> (): An optional function that is
always called when the component must be stopped, such as when the route is
changed. If not passed, a function that does nothing will be used.
 - fn `method`(`state`, `data`, `call`) -> `newState`: All remaining properties
of the `component` object are `methods` available to be called by the user
using `on{event}` or `data-on{event}` in the `template` or associated DOM
element or to be called internally by another `method` or `init` or `done`
through the use of the `call` function.
 - fn `call`(`method`, `data`) -> `newState`: Can call any `method` in the
component. Any DOM event will be a `call` with the `data` being the event
itself. The router starts the component with `call('init', data)` only then
the `methods` become available and the router stops the component with
`call('done')` and all the `methods` stop working. What exactly is inside
`data` in `init` will be covered next.

### root: DOM Element
Whenever the page's hash changes, the router resolves to a new state. If you
are not passing `routes` the router will not be mounted (and it is absolutely
unnecessary to pass `root`), otherwise it will listen for hash changes and
render the associated component in the `root` or `main` tag if `root` is not
is passed or `body` if there is no `main` tag in the body.

### routes: [{route, component}]
Array of `routes` that will be used to render a `component` within the `root`
element on page hash changes. The first route that matches the hash will be
used.
 - `route`: An optional string representing a hash path. It is allowed to use
`:var` to declare path variables.

Ex: `#/counter/:count` will match `#/counter/3` with `Path` {"count": 3}.

If you don't pass `route`, the router will match when no other routes match
(useful for creating 404 views).

 - `component`: An optional string with the `name` of a rootless `component`
defined in the `components` object. If no components are passed, whatever was
inside the `root` element before the router started will be re-rendered there,
this is useful for going back to an initial view that was SSR inside the
`root` before the router started.

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

New properties can be added to be passed to all rootless `components` using
your owns `middlewares`.

### userData and init
Any remaining properties present will be treated as `userData`. And they will
be passed at `component` `init` function.
   - `api`: It is a property that brings the `userData` associated to the
`component`.
   - `config`: It is a property that contains `userData` that is not associated
with any `component`.
   - `root`: DOM element that the router is mounted on.
   - `refresh`() -> (): A function that tells the router to restart the
component.

Rootless components are initialized (when the router matches a hash change)
with an object with properties defined by the result of `middleware`
(`url`, `path`, `query`, `route`, `Params`, `Query`) and any new properties
that the user-defined `middleware` brings.

### hashchange
A function that is called on all rooted components whenever the router matches
a new route, the `data` is the result of the middleware.

One use case could be if you want to implement a navigation bar as rooted
component and want to display the active route in links, you have to implement
in `methods` a method called `hashchange`.
          
### stop: () -> ()
Function that when called stops the `router` and all rooted components and
terminates the `merlin` application.

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
