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
      this._dataMarkerShape = "circle";
      this._lineColor = "000000";
      this._measures = [];
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

    onBeforeUpdate(changedProps) {
      console.log(changedProps);
    }
    onAfterUpdate(changedProps) {
      console.log(changedProps);
    }

    measuressubmit() {
      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              measures: ["A"],
            },
          },
        })
      );
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

      this.measuressubmit();

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

      // 각 시리즈마다 새로운 점 배열 시작
      const seriesPoints = [];

      singleSeries.dataPoints.forEach((dataPoint) => {
        const { dataInfo, labelInfo } = dataPoint;

        if (this._chartType == "stackedbar" && labelInfo) {
          labelInfo.pointValue = parseInt(dataInfo.pointValue[0]);
        }

        // 점 정보를 현재 시리즈의 배열에 추가
        if (dataInfo && !dataInfo.hidden && !dataInfo.outOfViewport) {
          seriesPoints.push({
            x: dataInfo.x + dataInfo.width / 2,
            y: dataInfo.y + dataInfo.height / 2,
          });
        }

        this.renderData(dataInfo, options);

        if (labelInfo) {
          this.renderLabel(labelInfo, options);
        }
      });

      // 현재 시리즈의 점들을 전체 points 배열에 추가
      if (seriesPoints.length > 0) {
        this._points.push(seriesPoints);
      }
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
    }

    drawLinesBetweenPoints() {
      const ctx = this._canvasElement.getContext("2d");
      ctx.clearRect(
        0,
        0,
        this._canvasElement.width,
        this._canvasElement.height
      );

      // 각 시리즈별로 선 그리기
      this._points.forEach((seriesPoints) => {
        if (seriesPoints.length < 2) return;

        // 선 스타일 설정
        ctx.strokeStyle = "#" + this._lineColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        ctx.beginPath();
        // 첫 번째 점으로 이동
        ctx.moveTo(seriesPoints[0].x, seriesPoints[0].y);

        // 나머지 점들을 순서대로 연결
        for (let i = 1; i < seriesPoints.length; i++) {
          ctx.lineTo(seriesPoints[i].x, seriesPoints[i].y);
        }

        ctx.stroke();
      });
    }

    renderLabel(labelInfo, options) {}

    renderAxisLabels(axisLabels) {}

    renderAxisStackLabels(axisStackLabels) {}

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

    set lineColor(value) {
      this._lineColor = value;
      this.render();
    }
  }

  customElements.define("viz-plotarea", Main);
})();
