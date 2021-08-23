# Pixel Art Editor

Pixel Art Editor is a pixel drawing program, where you can modify a picture pixel-by-pixel. This is done by manipulating a zoomed-in view of the picture (shown as a grid of colored squares). You can use the program to open image files, scribble on them with your mouse/touch device, and save them.

## Instructions

Install and run an HTTP server. Below is provided as an example, but others can be used.

```sh
yarn install http-server -g
http-server
```

Navigate to http://127.0.0.1:8080/app.html in your web browser (or wherever your HTTP server is running).

## Layout

The user interface for the application shows a big `<canvas>` element on top, with a number of form fields below it. The user draws on the picture by selecting a tool from a `<select>` field and then clicking, touching, or dragging across the canvas. There are tools for drawing single pixels or rectangles, for filling in an area, and for picking a color from the picture.

## Components

The editor interface is structured as a number of components. These components are objects that are responsible for a piece of the DOM and that may contain other components inside them.

The state of the application consists of the current picture, the selected tool, and the selected color. The state lives in a single value and the interface components always base the way they look on the current state. An interface component may respond to user actions by updating the state, at which point the components get a chance to synchronize themselves with this new state.

Each component is set up so that when it is given a new state, it also notifies its child components, insofar as those need to be updated.

Updates to the state are represented as objects, which are called _actions_. Components may create such actions and _dispatch_ them (give them to a central state management function). That function computes the next state, after which the interface components update themselves to this new state.

Though the DOM-related pieces are still full of side effects, they are held up by a conceptually simple backbone: the state update cycle. The state determines what the DOM looks like, and the only way DOM events can change the state is by dispatching actions to the state. In this way, we stick to the principle that state changes should go through a single well-defined channel and not happen all over the place.

The components are classes that conform to an interface. Their constructor is given a state (which may be the whole application state or some smaller value if it doesn't need access to everything) and uses that to build up a `dom` property (the DOM element that represents the component). Most constructors will also take some other values that won't change over time, such as the function they can use to dispatch an action.

Each component has a `syncState` method that is used to synchronize it to a new state value. The method takes one argument, the state, which is of the same type as the first argument to its constructor.
