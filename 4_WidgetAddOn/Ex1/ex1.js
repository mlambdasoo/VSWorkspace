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
      console.log(this.linecolor);
      this._lineColor = "";
    }
    onBeforeUpdate(changedProps) {
      console.log(this.linecolor);
      console.log(["this._lineColor", this._lineColor]);
      console.log(changedProps);
    }
    onAfterUpdate(changedProps) {
      console.log(changedProps);
    }

    render() {
      console.log("render");
      console.log(["this._lineColor", this._lineColor]);

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

      this.drawPoint(100, 100, 10, 10, this._lineColor);
    }

    drawPoint(x, y, width, height, color) {
      console.log("drawPoint");
      const sampleelement = SampleTemplate.content.cloneNode(true);
      const sampleContainer = sampleelement.querySelector(".sample-container");

      sampleContainer.setAttribute(
        "style",
        `background-color: ${color}; position: absolute; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px;
        }`
      );
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

    set lineColor(value) {
      console.log(["setlinecolor value main", value]);
      this._lineColor = value;
      console.log(["setlinecolor _linecolor main", value]);
      this.render();
      return "return";
    }
  }
  customElements.define("exercise-one", Main);
})();
