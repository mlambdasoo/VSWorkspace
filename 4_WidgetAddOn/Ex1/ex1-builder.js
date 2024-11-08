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
      console.log("builder constructor");
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
    onBeforeUpdate(changedProps) {
      console.log(["builder-Before", changedProps]);
    }
    onAfterUpdate(changedProps) {
      console.log(["builder-After", changedProps]);
    }

    _submit(e) {
      console.log(["_submit", this.lineColor]);
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
      console.log(["setlinecolor", value]);
      this._shadowRoot.getElementById("linecolor").value = value;
    }

    get lineColor() {
      console.log([
        "getlinecolor",
        this._shadowRoot.getElementById("linecolor").value,
      ]);
      return this._shadowRoot.getElementById("linecolor").value;
    }
  }

  customElements.define("exercise-one-builder", VizPlotareaBuilderPanel);
})();
