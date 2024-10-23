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
      this._shadowRoot = this.attachShadow({ mode: "open" });
      const container = OverlayContainerTemplate.content.cloneNode(true);
      this._containerElement = container.querySelector(
        ".chart-overlay-container"
      );
      this._markersContainer = container.querySelector(".markers-container");
      this._canvasElement = container.querySelector("#lineCanvas");
      this._shadowRoot.appendChild(container);
      this._dataMarkerShape = "circle";
      this._points = [];

      // 스타일 추가
      const style = document.createElement("style");
      style.textContent = `
        .chart-overlay-container {
          position: relative;
          pointer-events: none;
        }
        #lineCanvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
        .markers-container {
          position: relative;
          z-index: 2;
        }
      `;
      this._shadowRoot.appendChild(style);
    }

    render() {
      console.log("render");
      this._markersContainer.innerHTML = "";
      this._points = [];

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

      this._canvasElement.width = chartWidth + 20;
      this._canvasElement.height = chartHeight;

      this._series.forEach((singleSeries, index) => {
        const options = {};
        this.renderASeries(singleSeries, options);
      });

      this.drawLinesBetweenPoints();

      this.renderAxisLabels(this._xAxisLabels);
      this.renderAxisLabels(this._yAxisLabels);
      this.renderAxisStackLabels(this._xAxisStackLabels);
      this.renderAxisStackLabels(this._yAxisStackLabels);
    }

    renderASeries(singleSeries, options) {
      console.log("renderASeries");
      if (!singleSeries || !singleSeries.dataPoints) {
        return;
      }

      singleSeries.dataPoints.forEach((dataPoint) => {
        const { dataInfo, labelInfo } = dataPoint;

        if (this._chartType == "stackedbar" && labelInfo) {
          labelInfo.pointValue = parseInt(dataInfo.pointValue[0]);
        }

        // Render the data marker for current data point
        this.renderData(dataInfo, options);

        // Render the data label for current data point
        if (labelInfo) {
          this.renderLabel(labelInfo, options);
        }
      });
    }

    renderData(dataInfo, options) {
      if (!dataInfo || dataInfo.hidden || dataInfo.outOfViewport) {
        return;
      }

      let { x, y, width, height } = dataInfo;
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

      this._markersContainer.appendChild(dataElement);

      // 점 위치 저장
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
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(this._points[0].x, this._points[0].y);
      for (let i = 1; i < this._points.length; i++) {
        ctx.lineTo(this._points[i].x, this._points[i].y);
      }
      ctx.stroke();
    }

    renderLabel(labelInfo, options) {
      // 라벨 렌더링 로직 구현
      console.log("renderLabel", labelInfo);
    }

    renderAxisLabels(axisLabels) {
      // 축 라벨 렌더링 로직 구현
      console.log("renderAxisLabels", axisLabels);
    }

    renderAxisStackLabels(axisStackLabels) {
      // 스택 라벨 렌더링 로직 구현
      console.log("renderAxisStackLabels", axisStackLabels);
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
