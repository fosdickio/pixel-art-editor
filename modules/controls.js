import { elt } from "./dom.js";

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
