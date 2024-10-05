(function () {
  const template = document.createElement("template");
  template.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        Hello Custom Widget
        </div>
      `;
  class Main extends HTMLElement {
    constructor() {
      super();

      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("root");
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    onCustomWidgetAfterUpdate(changedProps) {
      console.log("onCustomWidgetAfterUpdate");
      this.render();
    }

    onCustomWidgetDestroy() {}

    async render() {
      const dataBinding = this.dataBinding;
      if (!dataBinding || dataBinding.state !== "success") {
        return (this._root.textContent =
          "There are some errors or No data return ");
      }
      this._root.textContent = JSON.stringify(dataBinding);
      console.log(JSON.stringify(dataBinding));
    }
  }

  customElements.define("com-sap-sac-exercise-lsd3-main", Main);
})();
