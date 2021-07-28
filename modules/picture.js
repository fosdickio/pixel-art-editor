/**
 * Picture is an object that stores the width, height, and pixel content of the
 * picture. It makes up part of the application state (along with tool and
 * color).
 *
 * A picture should be treated as an immutable value.
 *
 * Colors are stored as strings containing traditional CSS color codes made up
 * of a hash sign (#) followed by six hexadecimal (base-16) digits. They can
 * then be used in the fillStyle property of a canvas drawing context.
 */
export default class Picture {
  /**
   * Create a picture.
   * @param {number} width - The width of the picture (in pixels).
   * @param {number} height - The height of the picture (in pixels).
   * @param {Array} pixels - An array of updated pixels (objects with x, y, and
   * color properties).
   */
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }

  /**
   * Generates an empty picture based on a width, height, and color.
   * @param {number} width - The width of the picture (in pixels).
   * @param {number} height - The height of the picture (in pixels).
   * @param {string} color - A traditional CSS color code made up of a hash
   * sign (#) followed by six hexadecimal (base-16) digits.
   * @returns  {Picture} A new picture
   */
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }

  /**
   * Gets the pixel at a specified X and Y location.
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   * @returns {object} - A pixel object with x, y, and color properties.
   */
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }

  /**
   * Updates a whole bunch of pixels at a time. Expects an array of updated
   * pixels and creates a new picture with those pixels overwritten.
   * @param {Array} pixels - An array of updated pixels (objects with x, y, and
   * color properties).
   * @returns {Picture} A new picture with the specified pixels overwritten.
   */
  draw(pixels) {
    let copy = this.pixels.slice(); // Copy the entire pixel array
    for (let { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}
