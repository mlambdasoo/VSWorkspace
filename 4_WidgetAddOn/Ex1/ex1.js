(function () {
  const temp = document.createElement("template");
  temp.innerHTML = ``;

  class Main extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    onBeforeUpdate(changedProps) {
      console.log(changedProps);
    }
    onAfterUpdate(changedProps) {
      console.log(changedProps);
    }

    setExtensionData(extensionData) {
      console.log(extensionData);
      const { chartSize, chartType, primaryRows, secondaryRows } =
        extensionData;
      this._size = chartSize;
      this._chartType = chartType;
      this._primaryRows = primaryRows;
      this._secondaryRows = secondaryRows;
      this.render();
    }

    render() {}
  }
  customElements.define("viz-plotarea", Main);
})();
