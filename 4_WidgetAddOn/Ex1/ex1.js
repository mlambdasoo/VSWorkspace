(function () {
  const OverlayContainerTemplate = document.createElement("template");
  OverlayContainerTemplate.innerHTML = `<div class="chart-overlay-container"/></div>`;

  const SampleTemplate = document.createElement("template");
  SampleTemplate.innerHTML = `<div class="sample-container"/></div>`;

  class Main extends HTMLElement {
    constructor() {
      console.log("constructor");
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      const container = OverlayContainerTemplate.content.cloneNode(true);
      this._containerElement = container.querySelector(
        ".chart-overlay-container"
      );
      this._shadowRoot.appendChild(container);
    }
    onBeforeUpdate(changedProps) {
      console.log(changedProps);
    }
    onAfterUpdate(changedProps) {
      console.log(changedProps);
    }

    render() {
      console.log("render");
      const supportedChartTypes = ["barcolumn", "stackedbar", "line", "area"];
      if (!supportedChartTypes.includes(this._chartType)) {
        return;
      }

      const { width: chartWidth, height: chartHeight } = this._size;
      const { y: clipPathY, height: clipPathHeight } = this._clipPath;

      this._containerElement.setAttribute(
        "style",
        `overflow: hidden; width: ${
          chartWidth + 20
        }px; height: ${chartHeight}px; clip-path: inset(${clipPathY}px 0 ${
          chartHeight - clipPathY - clipPathHeight
        }px 0);`
      );

      this.drawPoint(100, 100, "red");
    }

    drawPoint(x, y, color) {
      console.log("drawPoint");
      const sampleelement = SampleTemplate.content.cloneNode(true);
      const sampleContainer = container.querySelector(".sample-container");

      sampleContainer.style.left = `${x}px`;
      sampleContainer.style.top = `${y}px`;
      sampleContainer.style.backgroundColor = color;
      this._containerElement.appendChild(sampleelement);
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
  customElements.define("ex1", Main);
})();
