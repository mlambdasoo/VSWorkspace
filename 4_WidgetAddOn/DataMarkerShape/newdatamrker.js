(function () {
  const plotareaFormTemplate = document.createElement("template");
  plotareaFormTemplate.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Plotarea Properties</legend>
            <div class="measureSettings">
              <div class="measure">
                <label>measure 0</label>
              </div>
              <div class="settings">
                <div>
                  <label class="name">>Name:</label>
                  <input id="measure0_Name" type="text" name="name" />
                </div>
                <div>
                  <label class="dotted">dotted:</label>
                  <input id="measure0_Dotted" type="text" name="opacity" />
                </div>
                <div>
                  <label class="lineColor">>Line Color (hex number):</label>
                  <input id="measure0_LineColor" type="text" name="lineColor" />
                </div>
                <div>
                  <label class="MarkerShape">MarkerShape:</label>
                  <input id="measure0_Shape" type="text" name="opacity" />
                </div>
              </div>
            </div>
            <div class="depthSettings">
              <div class="depth">
                <label>Depth 1</label>
              </div>
              <div class="settings">
                <div>
                  <label>Color:</label>
                  <input id="depth1_itemColor" type="text" name="color" />
                </div>
                <div>
                  <label class="lineOpacity">Line Opacity:</label>
                  <input id="depth1_lineOpacity" type="text" name="opacity" />
                </div>
              </div>
            </div>
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
      this._shadowRoot.appendChild(
        plotareaFormTemplate.content.cloneNode(true)
      );
      this._shadowRoot
        .getElementById("form")
        .addEventListener("submit", this._submit.bind(this));
      this._shadowRoot
        .getElementById("shapeSelect")
        .addEventListener("change", this._submit.bind(this));
      this._shadowRoot
        .getElementById("linecolor")
        .addEventListener("change", this._submit.bind(this));
    }

    updateMeasureSetting(settings, index) {
      this[`measure${index}Name`] = settings.measureName;
      this[`measure${index}Dotted`] = settings.dotted;
      this[`measure${index}LineColor`] = settings.lineColor;
      this[`measure${index}MarkerShape`] = settings.markerShape;
    }

    onMeasureSettingsChanged(index, e) {
      e.preventDefault();
      const properties = {};
      properties[`measure${index}Settings`] = {
        measureName: this[`measure${index}Name`],
        dotted: this[`measure${index}Dotted`],
        lineColor: this[`measure${index}LineColor`],
        markerShape: this[`measure${index}MarkerShape`],
      };

      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties,
          },
        })
      );
    }

    set measure0Name(value) {
      this._shadowRoot.getElementById("linecolor").value = value;
    }
    get measure0Name() {
      return this._shadowRoot.getElementById("linecolor").value;
    }
    set measure0Dotted(value) {
      this._shadowRoot.getElementById("linecolor").value = value;
    }

    get measure0Dotted() {
      return this._shadowRoot.getElementById("linecolor").value;
    }
    set measure0LineColor(value) {
      this._shadowRoot.getElementById("linecolor").value = value;
    }

    get measure0LineColor() {
      return this._shadowRoot.getElementById("linecolor").value;
    }
    set measure0MarkerShape(value) {
      this._shadowRoot.getElementById("linecolor").value = value;
    }
    get measure0MarkerShape() {
      return this._shadowRoot.getElementById("linecolor").value;
    }
  }

  customElements.define("viz-plotarea-build", VizPlotareaBuilderPanel);
})();
