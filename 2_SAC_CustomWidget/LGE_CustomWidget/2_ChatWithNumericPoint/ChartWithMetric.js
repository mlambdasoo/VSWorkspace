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
(function () {
  const template = document.createElement("template");
  template.innerHTML = `
          <style>
            .widget-container {
              position: relative;
              display: flex;
              height: 100vh;
            }
            .chart-container {
              min-width: 0;
              margin-right: 10px;
              position: relative;
             
            }
            .metrics-containers {
              display: flex;
              flex-shrink: 0;
            }
            .metric-container {
              position: relative;
              width: 200px;
              flex-shrink: 0;
              text-align: center;
            }
            .metric-label {
              text-align: center;
              font-weight: bold;
              margin-top: 40px;
              margin-bottom: 10px;
            }
            .metric {
              position: absolute;
              color: black;
              transform: translateY(-50%);
              width: 100%;
              text-align: center;
              left: 0;
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
      this._metricIndices = [0, 1]; // 기본값

      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._chart = null;
      this._chartContainer = this._shadowRoot.querySelector(".chart-container");
      this.dataBinding = {
        data: [
          {
            dimensions_0: {
              id: "[Product_3e315003an].[Product_Catego_3o3x5e06y2].&[PC4]",
              label: "Alcohol",
              isNode: true,
              isCollapsed: true,
            },
            measures_0: {
              raw: 173692344,
              formatted: "173.69M",
            },
            measures_1: {
              raw: 52307013.5012798,
              formatted: "52.31 Million",
              unit: "USD",
            },
            measures_2: {
              raw: 211823871.6960524,
              formatted: "211.82 Million",
              unit: "USD",
            },
          },
          {
            dimensions_0: {
              id: "[Product_3e315003an].[Product_Catego_3o3x5e06y2].&[PC1]",
              label: "Carbonated Drinks",
              isNode: true,
              isCollapsed: true,
            },
            measures_0: {
              raw: 145806660,
              formatted: "145.81M",
            },
            measures_1: {
              raw: 26891842.3188064,
              formatted: "26.89 Million",
              unit: "USD",
            },
            measures_2: {
              raw: 172815437.9767048,
              formatted: "172.82 Million",
              unit: "USD",
            },
          },
          {
            dimensions_0: {
              id: "[Product_3e315003an].[Product_Catego_3o3x5e06y2].&[PC2]",
              label: "Juices",
              isNode: true,
              isCollapsed: true,
            },
            measures_0: {
              raw: 286772400,
              formatted: "286.77M",
            },
            measures_1: {
              raw: 222132972.8288017,
              formatted: "222.13 Million",
              unit: "USD",
            },
            measures_2: {
              raw: 737192044.1781244,
              formatted: "737.19 Million",
              unit: "USD",
            },
          },
          {
            dimensions_0: {
              id: "[Product_3e315003an].[Product_Catego_3o3x5e06y2].&[PC3]",
              label: "Others",
              isNode: true,
              isCollapsed: true,
            },
            measures_0: {
              raw: 6651432,
              formatted: "6.65M",
            },
            measures_1: {
              raw: 1799437.027378,
              formatted: "1.80 Million",
              unit: "USD",
            },
            measures_2: {
              raw: 7278405.2119812,
              formatted: "7.28 Million",
              unit: "USD",
            },
          },
        ],
        metadata: {
          feeds: {
            measures: {
              values: ["measures_0", "measures_1", "measures_2"],
              type: "mainStructureMember",
            },
            dimensions: {
              values: ["dimensions_0"],
              type: "dimension",
            },
          },
          dimensions: {
            dimensions_0: {
              id: "Product_3e315003an",
              description: "Product",
            },
          },
          mainStructureMembers: {
            measures_0: {
              id: "[Account_BestRunJ_sold].[parentId].&[Gross_Margin]",
              label: "Gross Margin",
            },
            measures_1: {
              id: "[Account_BestRunJ_sold].[parentId].&[Discount]",
              label: "Discount",
            },
            measures_2: {
              id: "[Account_BestRunJ_sold].[parentId].&[Original_Sales_Price]",
              label: "Original Sales Price",
            },
          },
        },
        state: "success",
      };
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
      if (this._chart) {
        this._chart.destroy();
      }
    }

    async render() {
      await getScriptPromisify("https://cdn.jsdelivr.net/npm/chart.js");

      const { dimensions, measures } = parseMetadata(this.dataBinding.metadata);
      const data = this.dataBinding.data;

      const ctx = this._chartContainer.querySelector("canvas").getContext("2d");

      // 차트에 표시할 measure indices 계산
      const chartIndices = measures
        .map((_, index) => index)
        .filter((index) => !this._metricIndices.includes(index));

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
              const metricsCount = this._metricIndices.length;
              const chartContainer =
                this._shadowRoot.querySelector(".chart-container");
              chartContainer.style.width = `calc(100% - ${
                200 * metricsCount
              }px)`;
            },
            afterRender: (chart) => {
              const yAxis = chart.scales.y;
              const metricsContainers = this._shadowRoot.querySelector(
                ".metrics-containers"
              );

              metricsContainers.innerHTML = "";

              this._metricIndices.forEach((measureIndex) => {
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
