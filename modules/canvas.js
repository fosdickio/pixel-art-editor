import { elt } from "./dom.js";

// Determines how to draw each pixel.  In this case, as a 10-by-10 square.
const scale = 10;

/**
 * The PictureCanvas displays the picture as a grid of colored boxes. This
 * component is responsible for two things: showing a picture and communicating
 * pointer events on that picture to the rest of the application.
 *
 * It should only know about the current picture and not the whole application
 * state. Since it doesn’t know how the application as a whole works, it cannot
 * directly dispatch actions. Rather, when responding to pointer events, it
 * calls a callback function provided by the code that created it, which will
 * handle the application-specific parts.
 *
 * The component keeps track of its current picture and does a redraw only when
 * {@link PictureCanvas#syncState} is given a new picture.
 */
export default class PictureCanvas {
  /**
   * When the left mouse button is pressed while the mouse is over the picture
   * canvas, the component calls the pointerDown callback, giving it the
   * position of the pixel that was clicked—in picture coordinates. This will
   * be used to implement mouse interaction with the picture. The callback may
   * return another callback function to be notified when the pointer is moved
   * to a different pixel while the button is held down.
   * @param {Picture} picture
   * @param {Function} pointerDown
   */
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: (event) => this.mouse(event, pointerDown),
      ontouchstart: (event) => this.touch(event, pointerDown),
    });
    this.syncState(picture);
  }

  /**
   * Performs a redraw only when given a new picture.
   * @param {Picture} picture
   */
  syncState(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
}

/**
 * Sets the size of the canvas based on the scale and picture size and fills it
 * with a series of squares (one for each pixel).
 * @param {Picture} picture
 * @param {PictureCanvas} canvas
 * @param {number} scale
 */
export function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

/**
 * Used for mouse events.
 */
PictureCanvas.prototype.mouse = function (downEvent, onDown) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = (moveEvent) => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

/**
 * Since we know the size of the pixels and we can use getBoundingClientRect to
 * find the position of the canvas on the screen, it is possible to go from
 * mouse event coordinates (clientX and clientY) to picture coordinates. These
 * are always rounded down so that they refer to a specific pixel.
 */
function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale),
  };
}

/**
 * Used for touch events.
 */
PictureCanvas.prototype.touch = function (startEvent, onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = (moveEvent) => {
    let newPos = pointerPosition(moveEvent.touches[0], this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};
