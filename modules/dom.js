/**
 * Allows the interface to dispatch actions as objects whose properties
 * overwrite the properties of the previous state.
 */
export function updateState(state, action) {
  return { ...state, ...action };
}

/**
 * To be able to undo changes, we need to store previous versions of the
 * picture. A second array (done) has been added as an additional field in the
 * application state to store previous versions of the picture.
 *
 * Since we don’t want to store every change (only changes a certain amount of
 * time apart), we’ll need a second property (doneAt) which tracks the time at
 * which we last stored a picture in the history.
 *
 * When the action is an undo action, the function takes the most recent
 * picture from the history and makes that the current picture. It sets doneAt
 * to zero so that the next change is guaranteed to store the picture back in
 * the history, allowing you to revert it to another time if you want.
 *
 * Otherwise, if the action contains a new picture and the last time we stored
 * something is more than a second (1000 milliseconds) ago, the done and doneAt
 * properties are updated to store the previous picture.
 */
export function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0,
    });
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now(),
    });
  } else {
    return Object.assign({}, state, action);
  }
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
