(function () {
  const temp = document.createElement("template");
  temp.innerHTML = `
    <style>
    </style>
    <div id="root" style="width: 100%; height: 100%;">
    Hello World
    </div>
 `;
  class CustomWidget extends HTMLElement {
    constructor() {
      super();
      this.init();
    }

    init() {
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(temp.content.cloneNode(true));
      this._id = createGuid();
      var ctor = sap.m.DatePicker;
    }

    onCustomWidgetBeforeUpdate(changedProps) {}

    onCustomWidgetAfterUpdate(changedProps) {}

    onCustomWidgetDestroy() {}

    onCustomWidgetResize(width, height) {}
  }
  customElements.define("com-sapkorea-sac-sudong-base", CustomWidget);
})();
