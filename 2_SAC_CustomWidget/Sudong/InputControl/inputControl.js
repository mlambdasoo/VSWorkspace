var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

var parseMetadata = (metadata) => {
  const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } =
    metadata;
  const dimensions = [];
  for (const key in dimensionsMap) {
    const dimension = dimensionsMap[key];
    dimensions.push({ key, ...dimension });
  }
  const measures = [];
  for (const key in measuresMap) {
    const measure = measuresMap[key];
    measures.push({ key, ...measure });
  }
  return { dimensions, measures, dimensionsMap, measuresMap };
};

var transformData = (inputData) => {
  return inputData.map((item) => {
    const dim = item.dimensions_0;
    return {
      id: dim.id,
      parent: dim.parentId || "#",
      text: dim.label,
    };
  });
};

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
      @import "https://cdnjs.cloudflare.com/ajax/libs/jstree/3.3.12/themes/default/style.min.css";
      :host {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      #widget-container {
        font-family: Arial, sans-serif;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding: 10px;
        cursor: pointer;
      }
      #widget-title {
        font-weight: bold;
        flex-grow: 1;
      }
      #list {
        display: none;
        background-color: white;
        border: 1px solid #ccc;
        overflow-y: auto; /* 스크롤 추가 */
        margin-top: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
      }
    </style>
    <div id="widget-container">
      <div id="widget-title">Airline Code</div>
      <div id="widget-toggle">▼</div>
    </div>
    <div id="list"></div>
  `;

  class Main extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._list = this._shadowRoot.getElementById("list");
      this._widgetContainer =
        this._shadowRoot.getElementById("widget-container");
      this._widgetToggle = this._shadowRoot.getElementById("widget-toggle");
      this._isTreeVisible = false;
      this.selectedKey = [];
      this.selectedText = [];
    }

    onCustomWidgetResize(width, height) {
      console.log("onCustomWidgetResize");
    }

    onCustomWidgetAfterUpdate(changedProps) {
      console.log("onCustomWidgetAfterUpdate");
    }

    onCustomWidgetDestroy() {}

    databinding() {
      const dataBinding = this.dataBinding;
      if (!dataBinding || dataBinding.state !== "success") {
        return;
      }
      const { feed, data, metadata } = dataBinding;
      const { dimensions, measures } = parseMetadata(metadata);
      const treedata = transformData(data);
      return treedata;
    }
  }

  customElements.define("com-sap-sac-inputcontrol-sample1-main", Main);
})();
