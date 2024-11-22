class CustomUI5Element extends HTMLElement {
  connectedCallback() {
    // Web Component 내부 네임스페이스 분리를 위해 SAP UI5 로드
    const script = document.createElement("script");
    script.src = "2_SAC_CustomWidget/ui5Resources/sap-ui-core.js";
    script.id = "sap-ui-bootstrap-custom";

    // SAP UI5를 독립된 네임스페이스에 로드
    script.onload = () => {
      // 사용자 지정 네임스페이스를 생성
      const customUI5 = {};
      sap.ui.getCore().boot({
        globalNames: false,
        customNamespace: customUI5,
      });

      // 커스텀 네임스페이스에서 SAP UI5 객체 사용
      const button = new customUI5.m.Button({
        text: "Button from Custom Namespace",
      });

      // Web Component 내부에 배치
      button.placeAt(this.attachShadow({ mode: "open" }));
    };

    this.appendChild(script);
  }
}

customElements.define("custom-ui5-element", CustomUI5Element);
