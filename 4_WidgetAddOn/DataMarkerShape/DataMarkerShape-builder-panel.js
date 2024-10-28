(function () {
  const plotareaFormTemplate = document.createElement("template");
  plotareaFormTemplate.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Plotarea Properties</legend>
            <div class="measureSettings">
              <div class="measure">
                <label>Measure0</label>
              </div>
              <div class="settings">
                <div>
                  <label class="name">Name:</label>
                  <input id="measure0_Name" type="text" name="name" size="20" maxlength="20">
                </div>
                <div>
                  <label class="dotted">dotted:</label>
                  <input id="measure0_Dotted" type="checkbox">
                </div>
                <div>
                  <label class="lineColor">Line Color (hex number):</label>
                  <input id="measure0_LineColor" type="text" name="lineColor" size="20" maxlength="20">
                </div>
                <div>
                  <label class="makerShape">Select a shape</label>
                  <select id="measure0_shape">
                      <option value="circle" selected>Circle</option>
                      <option value="triangle">Triangle</option>
                      <option value="square">Square</option>
                      <option value="cross">Cross</option>
                  </select>
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
        .getElementById("measure0_Name")
        .addEventListener(
          "change",
          this.onMeasureSettingsChanged.bind(this, 0)
        );
      this._shadowRoot
        .getElementById("measure0_Dotted")
        .addEventListener(
          "change",
          this.onMeasureSettingsChanged.bind(this, 0)
        );
      this._shadowRoot
        .getElementById("measure0_LineColor")
        .addEventListener(
          "change",
          this.onMeasureSettingsChanged.bind(this, 0)
        );
      this._shadowRoot
        .getElementById("measure0_shape")
        .addEventListener(
          "change",
          this.onMeasureSettingsChanged.bind(this, 0)
        );
    }

    onBeforeUpdate(changedProps) {
      console.log(["before", changedProps]);
      this.updateMeasureSetting(changedProps["measure0Settings"], 0);
    }

    onAfterUpdate(changedProps) {
      console.log(["AFter", changedProps]);
    }

    updateMeasureSetting(settings, index) {
      this[`measure${index}Name`] = settings.measureName;
      this[`measure${index}Dotted`] = settings.dotted;
      this[`measure${index}LineColor`] = settings.lineColor;
      this[`measure${index}MarkerShape`] = settings.markerShape;
    }

    onMeasureSettingsChanged(index, e) {
      e.preventDefault();
      // const properties = {};
      // properties[`measure${index}Settings`].push({
      //   measureName: this[`measure${index}Name`],
      //   dotted: this[`measure${index}Dotted`],
      //   lineColor: this[`measure${index}LineColor`],
      //   markerShape: this[`measure${index}MarkerShape`],
      // });
      this._measures = [];
      this._measures.push({
        measureName: this[`measure${index}Name`],
        dotted: this[`measure${index}Dotted`],
        lineColor: this[`measure${index}LineColor`],
        markerShape: this[`measure${index}MarkerShape`],
      });

      //  console.log(["properties", properties]);
      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              measure0Settings: this._measures,
            },
          },
        })
      );
    }

    set measure0Settings(value) {
      console.log(value);
      this._shadowRoot.getElementById("measure0_Name").value = value;
    }
    get measure0Settings() {
      console.log(this._shadowRoot.getElementById("measure0_Name").value);
      return this._shadowRoot.getElementById("measure0_Name").value;
    }

    // set measure0Name(value) {
    //   this._shadowRoot.getElementById("measure0_Name").value = value;
    // }
    // get measure0Name() {
    //   return this._shadowRoot.getElementById("measure0_Name").value;
    // }
    // set measure0Dotted(value) {
    //   this._shadowRoot.getElementById("measure0_Dotted").checked = !!value;
    // }
    // get measure0Dotted() {
    //   return this._shadowRoot.getElementById("measure0_Dotted").checked;
    // }
    // set measure0LineColor(value) {
    //   this._shadowRoot.getElementById("measure0_LineColor").value = value;
    // }

    // get measure0LineColor() {
    //   return this._shadowRoot.getElementById("measure0_LineColor").value;
    // }
    // set measure0MarkerShape(value) {
    //   this._shadowRoot.getElementById("measure0_shape").value = value;
    // }
    // get measure0MarkerShape() {
    //   return this._shadowRoot.getElementById("measure0_shape").value;
    // }
  }

  customElements.define("viz-plotarea-build", VizPlotareaBuilderPanel);
})();
