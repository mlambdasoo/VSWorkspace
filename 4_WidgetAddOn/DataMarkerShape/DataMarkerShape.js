(function () {
  const OverlayContainerTemplate = document.createElement("template");
  OverlayContainerTemplate.innerHTML = `<div class="chart-overlay-container"><canvas id="lineCanvas"></canvas></div>`;

  const DataMarkerTemplate = document.createElement("template");
  DataMarkerTemplate.innerHTML = `<div class="series-data-marker-container"></div>`;

  class Main extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      const container = OverlayContainerTemplate.content.cloneNode(true);
      this._containerElement = container.querySelector(
        ".chart-overlay-container"
      );
      this._canvasElement = container.querySelector("#lineCanvas");
      this._shadowRoot.appendChild(container);
      this._dataMarkerShape = "circle";
      this._points = []; // 점 위치를 저장할 배열
    }

    render() {
      console.log("render");
      this._containerElement.innerHTML = "";

      const supportedChartTypes = ["barcolumn", "stackedbar", "line", "area"];

      if (!supportedChartTypes.includes(this._chartType)) {
        return;
      }

      const { width: chartWidth, height: chartHeight } = this._size;

      // Clip-path is used to prevent the chart elements are displayed out of viewing range
      const { y: clipPathY, height: clipPathHeight } = this._clipPath;
      this._containerElement.setAttribute(
        "style",
        `position: relative; pointer-events: none; overflow: hidden; width: ${
          chartWidth + 20
        }px; height: ${chartHeight}px; clip-path: inset(${clipPathY}px 0 ${
          chartHeight - clipPathY - clipPathHeight
        }px 0);`
      );

      this._canvasElement.width = chartWidth + 20;
      this._canvasElement.height = chartHeight;

      this._points = []; // 점을 그리기 전 위치 배열을 초기화

      this._series.forEach((singleSeries, index) => {
        const options = {};
        this.renderASeries(singleSeries, options);
      });

      // 모든 점이 그려진 후 선을 그림
      this.drawLinesBetweenPoints();

      // Render x-axis labels
      this.renderAxisLabels(this._xAxisLabels);

      // Render y-axis labels
      this.renderAxisLabels(this._yAxisLabels);

      // Render x-axis stacked labels
      this.renderAxisStackLabels(this._xAxisStackLabels);

      // Render y-axis stacked labels
      this.renderAxisStackLabels(this._yAxisStackLabels);
    }

    renderASeries(singleSeries, options) {
      console.log("renderASeries");
      singleSeries.dataPoints.forEach((dataPoint) => {
        const { dataInfo, labelInfo } = dataPoint;

        if (this._chartType == "stackedbar")
          labelInfo.pointValue = parseInt(dataInfo.pointValue[0]);

        // Render the data marker for current data point
        this.renderData(dataInfo, options);

        // Render the data label for current data point
        this.renderLabel(labelInfo, options);
      });
    }

    renderData(dataInfo, options) {
      console.log("renderData");
      if (!dataInfo || dataInfo.hidden || dataInfo.outOfViewport) {
        // Don't render the data marker if it's hidden or out of current viewing range
        return;
      }
      let { x, y, width, height } = dataInfo;

      const originalWidth = width;
      const originalHeight = height;

      // Clone the data marker template
      const dataElement = DataMarkerTemplate.content.cloneNode(true);
      const barColumnContainer = dataElement.querySelector(
        ".series-data-marker-container"
      );
      const color = dataInfo.color || options.color;
      let shape = ``;
      switch (this._dataMarkerShape) {
        case "circle":
          shape = `border-radius: 50%;`;
          break;
        case "rectangle":
          shape = ``;
          break;
        case "triangle":
          shape = `clip-path: polygon(50% 0%, 100% 100%, 0% 100%);`;
          break;
        case "cross":
          shape = `clip-path: polygon(0% 0%, 100% 100%, 0% 100%, 100% 0%);`;
          break;
      }

      barColumnContainer.setAttribute(
        "style",
        `${shape} background-color: ${color}; position: absolute; top: ${y}px; left: ${x}px; width: ${width}px; height: ${height}px;${
          dataInfo.opacity !== undefined ? `opacity: ${dataInfo.opacity};` : ""
        }`
      );

      this._containerElement.appendChild(dataElement);

      // 점 위치를 배열에 저장
      this._points.push({ x: x + width / 2, y: y + height / 2 });
    }

    drawLinesBetweenPoints() {
      const ctx = this._canvasElement.getContext("2d");

      if (this._points.length < 2) return;

      ctx.clearRect(
        0,
        0,
        this._canvasElement.width,
        this._canvasElement.height
      );

      // 선 스타일 설정
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); // 점선

      ctx.beginPath();
      for (let i = 0; i < this._points.length - 1; i++) {
        const point1 = this._points[i];
        const point2 = this._points[i + 1];
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
      }
      ctx.stroke();
    }

    renderLabel(labelInfo, options) {}
    renderAxisLabels(axisLabels) {}
    renderAxisStackLabels(axisStackLabels) {}

    onBeforeUpdate(changedProps) {
      console.log(changedProps);
    }
    onAfterUpdate(changedProps) {
      console.log(changedProps);
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

    set dataMarkerShape(value) {
      this._dataMarkerShape = value;
      this.render();
    }
  }
  customElements.define("viz-plotarea", Main);
})();
