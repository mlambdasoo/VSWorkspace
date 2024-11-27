var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve);
  });
};

(function () {
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
  const template = document.createElement("template");
  template.innerHTML = `
          <style>
            .widget-container {
              position: relative;
              display: flex;
              height: 100%;
              font-size: clamp(12px, 1.5vw, 16px);
            }
            .chart-container {
              min-width: 0;
              margin-right: 10px;
              position: relative;
              flex: 1;
            }
            .metrics-containers {
              display: flex;
              flex-shrink: 0;
            }
            .metric-container {
              position: relative;
              width: clamp(100px, 15vw, 250px);
              flex-shrink: 0;
              text-align: center;
            }
            .metric-label {
              text-align: center;
              font-weight: bold;
              margin-top: 20px;
              margin-bottom: 10px;
              font-size: clamp(14px, 1.8vw, 20px);
            }
            .metric {
              position: absolute;
              color: black;
              transform: translateY(-50%);
              width: 100%;
              text-align: center;
              left: 0;
              font-size: clamp(12px, 1.5vw, 18px);
            }
          </style>
          <div class="widget-container">
            <div class="chart-container">
              <canvas></canvas>
            </div>
            <div class="metrics-containers"></div>
          </div>
        `;

  class ChartWithMetric extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });

      // metric으로 표시할 measure indices를 속성으로 정의
      this._metricIndices = null; // 기본값

      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._chart = null;
      this._chartContainer = this._shadowRoot.querySelector(".chart-container");
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    onCustomWidgetBeforeUpdate(changedProps) {
      console.log("onCustomWidgetBeforeUpdate", changedProps);
      this.render();
    }

    onCustomWidgetAfterUpdate(changedProps) {
      console.log("onCustomWidgetAfterUpdate", changedProps);
      this.render();
    }

    async render() {
      console.log("render");
      const dataBinding = this.myDataBinding;
      if (!dataBinding || dataBinding.state !== "success") {
        return;
      }
      await getScriptPromisify("https://cdn.jsdelivr.net/npm/chart.js");

      const { data, metadata } = dataBinding;
      const { dimensions, measures } = parseMetadata(metadata);

      const ctx = this._chartContainer.querySelector("canvas").getContext("2d");

      // 차트에 표시할 measure indices 계산
      const chartIndices = measures
        .map((_, index) => index)
        .filter((index) => !(this._metricIndices || []).includes(index));

      // 차트 데이터 동적 생성
      const chartData = {
        labels: data.map((item) => item.dimensions_0.label),
        datasets: chartIndices.map((measureIndex) => ({
          label: measures[measureIndex].label,
          data: data.map((item) => item[`measures_${measureIndex}`].raw),
          backgroundColor: `rgba(${Math.random() * 255}, ${
            Math.random() * 255
          }, ${Math.random() * 255}, 0.2)`,
        })),
      };
      console.log("chartData", chartData);

      const config = {
        type: "bar",
        data: chartData,
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0,
          },
          scales: {
            x: {
              beginAtZero: true,
              stacked: false,
            },
            y: {
              grid: {
                display: false,
              },
              stacked: false,
            },
          },
        },
        plugins: [
          {
            id: "customMetrics",
            beforeInit: (chart) => {
              const metricsCount = (this._metricIndices || []).length;
              const chartContainer =
                this._shadowRoot.querySelector(".chart-container");

              // viewport width를 기준으로 metric container 너비 계산
              const metricWidth = Math.min(
                Math.max(150, window.innerWidth * 0.15),
                250
              );

              chartContainer.style.width = `calc(100% - ${
                metricWidth * metricsCount
              }px)`;
            },
            afterRender: (chart) => {
              const yAxis = chart.scales.y;
              const metricsContainers = this._shadowRoot.querySelector(
                ".metrics-containers"
              );

              metricsContainers.innerHTML = "";

              (this._metricIndices || []).forEach((measureIndex) => {
                const container = document.createElement("div");
                container.className = "metric-container";

                const labelDiv = document.createElement("div");
                labelDiv.className = "metric-label";
                labelDiv.textContent = measures[measureIndex].label;
                container.appendChild(labelDiv);

                metricsContainers.appendChild(container);

                yAxis.ticks.forEach((tick, index) => {
                  const yPos = yAxis.getPixelForTick(index);
                  const metric = document.createElement("div");
                  metric.className = "metric";
                  metric.textContent =
                    data[index][`measures_${measureIndex}`].formatted;
                  metric.style.top = yPos + "px";
                  container.appendChild(metric);
                });
              });
            },
          },
        ],
      };

      if (this._chart) {
        this._chart.destroy();
      }

      this._chart = new Chart(ctx, config);
    }
  }

  customElements.define("com-sap-sac-chart-with-metric", ChartWithMetric);
})();
