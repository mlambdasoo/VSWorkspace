const plotareaFormTemplate = document.createElement("template");
plotareaFormTemplate.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Plotarea Properties</legend>
            <label for="shapeSelect">Select a shape:</label>
            <select id="shapeSelect">
                <option value="circle" selected>Circle</option>
                <option value="triangle">Triangle</option>
                <option value="square">Square</option>
                <option value="cross">Cross</option>
            </select>
            <input type="submit" style="display:none;">
        </fieldset>
    </form>
    <style>
    :host {
        display: block;
        padding: 1em 1em 1em 1em;
    }
    </style>
`;

class VizPlotareaBuilderPanel extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(plotareaFormTemplate.content.cloneNode(true));
    this._shadowRoot
      .getElementById("form")
      .addEventListener("submit", this._submit.bind(this));
    this._shadowRoot
      .getElementById("shapeSelect")
      .addEventListener("change", this._submit.bind(this));
  }

  _submit(e) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent("propertiesChanged", {
        detail: {
          properties: {
            // property 변경--rounded
            dataMarkerShape: this.dataMarkerShape,
          },
        },
      })
    );
  }

  set dataMarkerShape(value) {
    this._shadowRoot.getElementById("shapeSelect").value = value;
  }

  get dataMarkerShape() {
    return this._shadowRoot.getElementById("shapeSelect").value;
  }
}

customElements.define("viz-plotarea-build-en", VizPlotareaBuilderPanel);
