(function () {
  const template = document.createElement("template");
  template.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        Hello Custom Widget
        </div>
      `;
  class Basic extends HTMLElement {
    ////최초 생성 및 호출 시 아래 순서로 connectedCallback까지 순서대로 호출////
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      console.log("constructor");
    }

    ///Custom widget의 업데이트가 발생하는경우 AfterUpdate까지 순서대로 호출///
    onCustomWidgetBeforeUpdate(changedProps) {
      console.log(["onCustomWidgetBeforeUpdate", changedProps]);
    }

    //Setter function 호출

    onCustomWidgetAfterUpdate(changedProps) {
      console.log(["onCustomWidgetAfterUpdate", changedProps]);
      //Property의 Default값이 할당되는 시점
      console.log(this.charttype);
    }

    connectedCallback() {
      console.log("ConnectedCallback");
    }

    ////custom widget 크기가 조정 될때////
    onCustomWidgetResize(width, height) {
      this.render();
    }

    ////Custom Widget이 삭제 되거나, Story를 닫는경우////
    ///Custom Widget이 invible인 경우 onCustomWidgetDestroy은 호출되지 않음
    onCustomWidgetDestroy() {
      console.log("onCustomWidgetDestroy");
    }
    disconnectedCallback() {
      console.log("disconnectedCallback");
    }

    setChartType(value) {
      this.charttype = value;
      console.log(this.charttype);
      // this.dispatchEvent(
      //   new CustomEvent("propertiesChanged", {
      //     detail: { properties: { value } },
      //   })
      // );
    }

    getChartType() {
      return this.charttype;
    }

    async render() {
      console.log("render");
      const dataBinding = this.myDataBinding;
      if (!dataBinding || dataBinding.state !== "success") {
        return;
      }
      this._root.textContent = JSON.stringify(dataBinding);
      console.log(JSON.stringify(dataBinding));
    }
  }

  customElements.define("com-sap-sac-exercise-lsd-method", Basic);
})();
