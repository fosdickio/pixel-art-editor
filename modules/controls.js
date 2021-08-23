import { elt } from "./dom.js";
import { drawPicture } from "./canvas.js";
import Picture from "./picture.js";

/**
 * ToolSelect creates a <select> element with an option for each tool and sets
 * up a "change" event handler that updates the application state when the user
 * selects a different tool.
 */
export class ToolSelect {
  constructor(state, { tools, dispatch }) {
    this.select = elt(
      "select",
      {
        onchange: () => dispatch({ tool: this.select.value }),
      },
      ...Object.keys(tools).map((name) =>
        elt(
          "option",
          {
            selected: name == state.tool,
          },
          name
        )
      )
    );
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
  }

  syncState(state) {
    this.select.value = state.tool;
  }
}

/**
 * ColorSelect creates an HTML <input> element with a type attribute of color
 * and wires it up to stay synchronized with the application state's color
 * property.
 */
export class ColorSelect {
  constructor(state, { dispatch }) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({ color: this.input.value }),
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }

  syncState(state) {
    this.input.value = state.color;
  }
}

/**
 * The SaveButton component keeps track of the current picture so that it can
 * access it when saving. To create the image file, it uses a <canvas> element
 * that it draws the picture on (at a scale of one pixel per pixel).
 */
export class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt(
      "button",
      {
        onclick: () => this.save(),
      },
      "💾 Save"
    );
  }

  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      // The toDataURL method on a canvas element creates a URL that starts
      // with data:. Unlike http: and https: URLs, data URLs contain the whole
      // resource in the URL. They are usually very long, but they allow the
      // ability to create working links to arbitrary pictures
      href: canvas.toDataURL(),
      // To actually get the browser to download the picture, a link element is
      // created that points at the URL and has a download attribute. Such
      // links, when clicked, make the browser show a file save dialog.
      download: "pixel-art-image.png",
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  syncState(state) {
    this.picture = state.picture;
  }
}

export class LoadButton {
  constructor(_, { dispatch }) {
    this.dom = elt(
      "button",
      {
        onclick: () => startLoad(dispatch),
      },
      "📁 Load"
    );
  }

  syncState() {}
}

/**
 * A file input field is used to get access to a file on the user's computer.
 * Since we don't want the file to look like a file input field, we create the
 * file input when the button is clicked and then pretend that this file input
 * itself was clicked.
 */
function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch),
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

/**
 * When the user has selected a file, we can use FileReader to get access to
 * its contents, again as a data URL. That URL can be used to create an <img>
 * element, but because we can’t get direct access to the pixels in such an
 * image, we can’t create a Picture object from that.
 */
function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () =>
        dispatch({
          picture: pictureFromImage(image),
        }),
      src: reader.result,
    });
  });
  reader.readAsDataURL(file);
}

/**
 * To get access to the pixels, we must first draw the picture to a <canvas>
 * element. The canvas context has a getImageData method that allows a script
 * to read its pixels. So, once the picture is on the canvas, we can access it
 * and construct a Picture object.
 */
function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", { width, height });
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  // The data property of the object returned by getImageData is an array of
  // color components. For each pixel in the rectangle specified by the
  // arguments, it contains four values, which represent the red, green, blue,
  // and alpha components of the pixel’s color (as numbers between 0 and 255).
  let { data } = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }

  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }

  return new Picture(width, height, pixels);
}

/**
 * The UndoButton dispatches undo actions when clicked and disables itself when
 * there is nothing to undo.
 */
export class UndoButton {
  constructor(state, { dispatch }) {
    this.dom = elt(
      "button",
      {
        onclick: () => dispatch({ undo: true }),
        disabled: state.done.length == 0,
      },
      "🔙 Undo"
    );
  }

  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}
