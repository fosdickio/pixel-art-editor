import Picture from "./modules/picture.js";
import PixelEditor from "./modules/editor.js";
import { draw, fill, rectangle, pick } from "./modules/tools.js";
import { ToolSelect, ColorSelect } from "./modules/controls.js";
import { updateState } from "./modules/dom.js";

let state = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
};

let app = new PixelEditor(state, {
  tools: { draw, fill, rectangle, pick },
  controls: [ToolSelect, ColorSelect],
  dispatch(action) {
    state = updateState(state, action);
    app.syncState(state);
  },
});

document.querySelector("div").appendChild(app.dom);
