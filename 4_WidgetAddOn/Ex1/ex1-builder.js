(function () {
  const plotareaFormTemplate = document.createElement("template");
  plotareaFormTemplate.innerHTML = `
    <form id="form">
        <fieldset>
            <legend>Plotarea Properties</legend>
            <label for="linecolor">Line color(hex code):</label>
            <input id="linecolor" type="text" size="6" maxlength="6" value="000000">
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
      this._shadowRoot.appendChild(
        plotareaFormTemplate.content.cloneNode(true)
      );
      this._shadowRoot
        .getElementById("form")
        .addEventListener("submit", this._submit.bind(this));
      this._shadowRoot
        .getElementById("linecolor")
        .addEventListener("change", this._submit.bind(this));
    }

    _submit(e) {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              lineColor: this.lineColor,
            },
          },
        })
      );
    }

    set lineColor(value) {
      this._shadowRoot.getElementById("linecolor").value = value;
    }

    get lineColor() {
      return this._shadowRoot.getElementById("linecolor").value;
    }
  }

  customElements.define("exercise-one-builder", VizPlotareaBuilderPanel);
})();
