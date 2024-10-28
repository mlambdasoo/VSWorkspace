(function () {
  const OverlayContainerTemplate = document.createElement("template");
  OverlayContainerTemplate.innerHTML = `
    <div class="chart-overlay-container">
      <canvas id="lineCanvas"></canvas>
      <div class="markers-container"></div>
    </div>
  `;

  const DataMarkerTemplate = document.createElement("template");
  DataMarkerTemplate.innerHTML = `<div class="series-data-marker-container"></div>`;

  class Main extends HTMLElement {
    constructor() {
      super();
      console.log("constructor");
      this._shadowRoot = this.attachShadow({ mode: "open" });
      const container = OverlayContainerTemplate.content.cloneNode(true);
      this._containerElement = container.querySelector(
        ".chart-overlay-container"
      );
      this._markersContainer = container.querySelector(".markers-container");
      this._canvasElement = container.querySelector("#lineCanvas");
      this._shadowRoot.appendChild(container);
      this._points = [];
    }

    setExtensionData(extensionData) {
      console.log(extensionData);
      const {
        chartType,
        isHorizontal,
        chartSize,
        clipPath,
        series,
        xAxisLabels,
        xAxisStackLabels,
        yAxisLabels,
        yAxisStackLabels,
      } = extensionData;
      this._size = chartSize;
      this._clipPath = clipPath;
      this._series = series;
      this._xAxisLabels = xAxisLabels;
      this._yAxisLabels = yAxisLabels;
      this._xAxisStackLabels = xAxisStackLabels;
      this._yAxisStackLabels = yAxisStackLabels;
      this._chartType = chartType;
      this._isHorizontal = isHorizontal;
      this.render();
    }
  }

  customElements.define("viz-plotarea", Main);
})();
