/**
 * The draw tool changes any pixel you click or tap to the currently selected
 * color. It dispatches an action that updates the picture to a version in
 * which the pointed-at pixel is given the currently selected color.
 *
 * The function immediately calls the drawPixel function but then also returns
 * it so that it is called again for newly touched pixels when the user drags
 * or swipes over the picture.
 */
export function draw(pos, state, dispatch) {
  function drawPixel({ x, y }, state) {
    let drawn = { x, y, color: state.color };
    dispatch({ picture: state.picture.draw([drawn]) });
  }

  drawPixel(pos, state);
  return drawPixel;
}

/**
 * The rectangle tool draws a rectangle between the point where you start
 * dragging and the point that you drag to.
 *
 * An important detail in this implementation is that when dragging, the
 * rectangle is redrawn on the picture from the original state. That way, you
 * can make the rectangle larger and smaller again while creating it, without
 * the intermediate rectangles sticking around in the final picture.
 */
export function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }

  drawRectangle(start);
  return drawRectangle;
}

const around = [
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
];

/**
 * The flood tool fills the pixel under the pointer and all adjacent pixels
 * that have the same color. "Adjacent" means directly horizontally or
 * vertically adjacent (not diagonally).
 *
 * The array of drawn pixels doubles as the function’s work list. For each
 * pixel reached, we have to see whether any adjacent pixels have the same
 * color and haven’t already been painted over. The loop counter lags behind
 * the length of the drawn array as new pixels are added. Any pixels ahead of
 * it still need to be explored. When it catches up with the length, no
 * unexplored pixels remain, and the function is done.
 */
export function fill({ x, y }, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{ x, y, color: state.color }];

  for (let done = 0; done < drawn.length; done++) {
    for (let { dx, dy } of around) {
      let x = drawn[done].x + dx,
        y = drawn[done].y + dy;
      if (
        x >= 0 &&
        x < state.picture.width &&
        y >= 0 &&
        y < state.picture.height &&
        state.picture.pixel(x, y) == targetColor &&
        !drawn.some((p) => p.x == x && p.y == y)
      ) {
        drawn.push({ x, y, color: state.color });
      }
    }
  }

  dispatch({ picture: state.picture.draw(drawn) });
}

/**
 * The color picker allows you to point at a color in the picture and use it as
 * the current drawing color.
 */
export function pick(pos, state, dispatch) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}
