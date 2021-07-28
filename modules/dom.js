/**
 * Allows the interface to dispatch actions as objects whose properties
 * overwrite the properties of the previous state.
 */
export function updateState(state, action) {
  return { ...state, ...action };
}

/**
 * Helper function that assigns properties to DOM nodes.  Used for creating DOM
 * structure, since we don't want to directly use the verbose DOM methods for
 * that.  Can be used to set properties whose value aren't a string (such as
 * onclick), which can be set to a function to register a click event handler.
 *
 * Example:
 *  document.body.appendChild(elt("button", {
 *    onclick: () => console.log("click")
 *  }, "The button"));
 */
export function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}
