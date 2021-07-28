import PictureCanvas from "./canvas.js";
import { elt } from "./dom.js";

/**
 * PixelEditor is the main component, which acts as a shell around a picture
 * canvas and a dynamic set of tools and controls that are passed to its
 * constructor.
 *
 * The controls are the interface elements that appear below the picture. They
 * are provided as an array of component constructors.
 *
 * The tools do things like drawing pixels or filling in an area. The
 * application shows the set of available tools as a <select> field. The
 * currently selected tool determines what happens when the user interacts with
 * the picture with a pointer device. The set of available tools is provided as
 * an object that maps the names that appear in the drop-down field to
 * functions that implement the tools. Such functions get a picture position, a
 * current application state, and a dispatch function as arguments. They may
 * return a move handler function that gets called with a new position and a
 * current state when the pointer moves to a different pixel.
 */
export default class PixelEditor {
  constructor(state, config) {
    let { tools, controls, dispatch } = config;
    this.state = state;

    // The pointer handler given to PictureCanvas calls the currently selected
    // tool with the appropriate arguments and, if that returns a move handler,
    // adapts it to also receive the state.
    this.canvas = new PictureCanvas(state.picture, (pos) => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return (pos) => onMove(pos, this.state);
    });

    // All controls are constructed and stored in this.controls so that they
    // can be updated when the application state changes.
    this.controls = controls.map((Control) => new Control(state, config));

    this.dom = elt(
      "div",
      {},
      this.canvas.dom,
      elt("br"),
      // The call to reduce introduces spaces between the controls' DOM
      // elements, so they don't look so pressed together.
      ...this.controls.reduce((a, c) => a.concat(" ", c.dom), [])
    );
  }

  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}
