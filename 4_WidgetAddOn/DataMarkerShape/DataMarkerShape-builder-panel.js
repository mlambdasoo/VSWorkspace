(function () {
  const plotareaFormTemplate = document.createElement("template");
  plotareaFormTemplate.innerHTML = `
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
            <label class="makerShape">Select a shape:</label>
            <select id="measure0_shape">
                <option value="circle" selected>Circle</option>
                <option value="triangle">Triangle</option>
                <option value="square">Square</option>
                <option value="cross">Cross</option>
            </select>
        </div>
    </div>
</div>

<div class="measureSettings">
    <div class="measure">
        <label>Measure1</label>
    </div>
    <div class="settings">
        <div>
            <label class="name">Name:</label>
            <input id="measure1_Name" type="text" name="name" size="20" maxlength="20">
        </div>
        <div>
            <label class="dotted">dotted:</label>
            <input id="measure1_Dotted" type="checkbox">
        </div>
        <div>
            <label class="lineColor">Line Color (hex number):</label>
            <input id="measure1_LineColor" type="text" name="lineColor" size="20" maxlength="20">
        </div>
        <div>
            <label class="makerShape">Select a shape:</label>
            <select id="measure1_shape">
                <option value="circle" selected>Circle</option>
                <option value="triangle">Triangle</option>
                <option value="square">Square</option>
                <option value="cross">Cross</option>
            </select>
        </div>
    </div>
</div>

<div class="measureSettings">
    <div class="measure">
        <label>Measure2</label>
    </div>
    <div class="settings">
        <div>
            <label class="name">Name:</label>
            <input id="measure2_Name" type="text" name="name" size="20" maxlength="20">
        </div>
        <div>
            <label class="dotted">dotted:</label>
            <input id="measure2_Dotted" type="checkbox">
        </div>
        <div>
            <label class="lineColor">Line Color (hex number):</label>
            <input id="measure2_LineColor" type="text" name="lineColor" size="20" maxlength="20">
        </div>
        <div>
            <label class="makerShape">Select a shape:</label>
            <select id="measure2_shape">
                <option value="circle" selected>Circle</option>
                <option value="triangle">Triangle</option>
                <option value="square">Square</option>
                <option value="cross">Cross</option>
            </select>
        </div>
    </div>
</div>

<div class="measureSettings">
    <div class="measure">
        <label>Measure3</label>
    </div>
    <div class="settings">
        <div>
            <label class="name">Name:</label>
            <input id="measure3_Name" type="text" name="name" size="20" maxlength="20">
        </div>
        <div>
            <label class="dotted">dotted:</label>
            <input id="measure3_Dotted" type="checkbox">
        </div>
        <div>
            <label class="lineColor">Line Color (hex number):</label>
            <input id="measure3_LineColor" type="text" name="lineColor" size="20" maxlength="20">
        </div>
        <div>
            <label class="makerShape">Select a shape:</label>
            <select id="measure3_shape">
                <option value="circle" selected>Circle</option>
                <option value="triangle">Triangle</option>
                <option value="square">Square</option>
                <option value="cross">Cross</option>
            </select>
        </div>
    </div>
</div>

<style>
    /* 제목 스타일 */
    legend {
        font-size: 1.2em;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
    }

    /* 그룹의 테두리 스타일 */
    .measureSettings {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 15px;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    /* 그룹 내 제목 스타일 */
    .measure label {
        font-weight: bold;
        font-size: 1.1em;
        color: #555;
    }

    /* 각 설정 항목 스타일 */
    .settings > div {
        margin-bottom: 8px;
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
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure0_Dotted")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure0_LineColor")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure0_shape")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure1_Name")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure1_Dotted")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure1_LineColor")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure1_shape")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure2_Name")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure2_Dotted")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure2_LineColor")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure2_shape")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure3_Name")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure3_Dotted")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure3_LineColor")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
      this._shadowRoot
        .getElementById("measure3_shape")
        .addEventListener("change", this.onMeasureSettingsChanged.bind(this));
    }

    onBeforeUpdate(changedProps) {
      console.log(["before", changedProps]);
    }

    onAfterUpdate(changedProps) {
      console.log(["AFter", changedProps]);
    }

    onMeasureSettingsChanged(e) {
      e.preventDefault();

      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              measure0Name: this.measure0Name,
              measure0Dotted: this.measure0Dotted,
              measure0LineColor: this.measure0LineColor,
              measure0MarkerShape: this.measure0MarkerShape,
              measure1Name: this.measure1Name,
              measure1Dotted: this.measure1Dotted,
              measure1LineColor: this.measure1LineColor,
              measure1MarkerShape: this.measure1MarkerShape,
              measure2Name: this.measure2Name,
              measure2Dotted: this.measure2Dotted,
              measure2LineColor: this.measure2LineColor,
              measure2MarkerShape: this.measure2MarkerShape,
              measure3Name: this.measure3Name,
              measure3Dotted: this.measure3Dotted,
              measure3LineColor: this.measure3LineColor,
              measure3MarkerShape: this.measure3MarkerShape,
            },
          },
        })
      );
    }

    set measure0Name(value) {
      this._shadowRoot.getElementById("measure0_Name").value = value;
    }
    get measure0Name() {
      return this._shadowRoot.getElementById("measure0_Name").value;
    }
    set measure0Dotted(value) {
      this._shadowRoot.getElementById("measure0_Dotted").checked = !!value;
    }
    get measure0Dotted() {
      return this._shadowRoot.getElementById("measure0_Dotted").checked;
    }
    set measure0LineColor(value) {
      this._shadowRoot.getElementById("measure0_LineColor").value = value;
    }
    get measure0LineColor() {
      return this._shadowRoot.getElementById("measure0_LineColor").value;
    }
    set measure0MarkerShape(value) {
      this._shadowRoot.getElementById("measure0_shape").value = value;
    }
    get measure0MarkerShape() {
      return this._shadowRoot.getElementById("measure0_shape").value;
    }
    set measure1Name(value) {
      this._shadowRoot.getElementById("measure1_Name").value = value;
    }
    get measure1Name() {
      return this._shadowRoot.getElementById("measure1_Name").value;
    }
    set measure1Dotted(value) {
      this._shadowRoot.getElementById("measure0_Dotted").checked = !!value;
    }
    get measure1Dotted() {
      return this._shadowRoot.getElementById("measure0_Dotted").checked;
    }
    set measure1LineColor(value) {
      this._shadowRoot.getElementById("measure0_LineColor").value = value;
    }
    get measure1LineColor() {
      return this._shadowRoot.getElementById("measure0_LineColor").value;
    }
    set measure1MarkerShape(value) {
      this._shadowRoot.getElementById("measure0_shape").value = value;
    }
    get measure1MarkerShape() {
      return this._shadowRoot.getElementById("measure0_shape").value;
    }
    set measure2Name(value) {
      this._shadowRoot.getElementById("measure1_Name").value = value;
    }
    get measure2Name() {
      return this._shadowRoot.getElementById("measure1_Name").value;
    }
    set measure2Dotted(value) {
      this._shadowRoot.getElementById("measure0_Dotted").checked = !!value;
    }
    get measure2Dotted() {
      return this._shadowRoot.getElementById("measure0_Dotted").checked;
    }
    set measure2LineColor(value) {
      this._shadowRoot.getElementById("measure0_LineColor").value = value;
    }
    get measure2LineColor() {
      return this._shadowRoot.getElementById("measure0_LineColor").value;
    }
    set measure2MarkerShape(value) {
      this._shadowRoot.getElementById("measure0_shape").value = value;
    }
    get measure2MarkerShape() {
      return this._shadowRoot.getElementById("measure0_shape").value;
    }
    set measure3Name(value) {
      this._shadowRoot.getElementById("measure1_Name").value = value;
    }
    get measure3Name() {
      return this._shadowRoot.getElementById("measure1_Name").value;
    }
    set measure3Dotted(value) {
      this._shadowRoot.getElementById("measure0_Dotted").checked = !!value;
    }
    get measure3Dotted() {
      return this._shadowRoot.getElementById("measure0_Dotted").checked;
    }
    set measure3LineColor(value) {
      this._shadowRoot.getElementById("measure0_LineColor").value = value;
    }
    get measure3LineColor() {
      return this._shadowRoot.getElementById("measure0_LineColor").value;
    }
    set measure3MarkerShape(value) {
      this._shadowRoot.getElementById("measure0_shape").value = value;
    }
    get measure3MarkerShape() {
      return this._shadowRoot.getElementById("measure0_shape").value;
    }
  }

  customElements.define("viz-plotarea-build", VizPlotareaBuilderPanel);
})();
