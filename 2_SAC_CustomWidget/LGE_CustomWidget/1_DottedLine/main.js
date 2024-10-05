var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
    $.getScript(src, resolve)
  })
}

var parseMetadata = metadata => {
  const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata
  const dimensions = []
  for (const key in dimensionsMap) {
    const dimension = dimensionsMap[key]
    dimensions.push({ key, ...dimension })
  }
  const measures = []
  for (const key in measuresMap) {
    const measure = measuresMap[key]
    measures.push({ key, ...measure })
  }
  return { dimensions, measures, dimensionsMap, measuresMap }
}

(function () {
  const template = document.createElement('template')
  template.innerHTML = `
        <style>
        </style>
          <div id="root" style="width: 100%; height: 100%;">
            <canvas id="myChart"></canvas>        
        </div>
      `
  class Main extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(template.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('main')

      this.chartjs = null

    }

    onCustomWidgetResize (width, height) {
      this.render()
    }

    onCustomWidgetAfterUpdate (changedProps) {
      this.render()
    }

  
    onCustomWidgetDestroy () {
    
  }

    async render () {
      const dataBinding = this.dataBinding
      if (!dataBinding || dataBinding.state !== 'success') { return }

      await getScriptPromisify('https://cdn.jsdelivr.net/npm/chart.js')
        // 샘플 데이터
        const data = {
          labels: ['1월', '2월', '3월', '4월', '5월'],
          datasets: [
              {
                  label: '제품 A',
                  data: [12, 19, 3, 5, 2],
                  backgroundColor: 'rgba(255, 99, 132, 0.8)',
              },
              {
                  label: '제품 B',
                  data: [2, 3, 20, 5, 1],
                  backgroundColor: 'rgba(54, 162, 235, 0.8)',
              },
              {
                  label: '제품 C',
                  data: [3, 10, 13, 15, 22],
                  backgroundColor: 'rgba(75, 192, 192, 0.8)',
              }
          ]
      };

      // 누적 총합을 표시하는 플러그인
      const stackedBarTotalPlugin = {
          id: 'stackedBarTotal',
          afterDraw: (chart, args, options) => {
              const { ctx, data, scales: { x, y }, chartArea } = chart;

              ctx.save();
              ctx.font = 'bold 12px Arial';
              ctx.fillStyle = 'black';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              data.datasets[0].data.forEach((_, index) => {
                  const total = data.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
                  const xPos = x.getPixelForValue(index);
                  const yPos = y.getPixelForValue(total);

                  ctx.fillText(total, xPos, yPos - 5);
              });

              ctx.restore();
          }
      };

      // 차트 설정
      const config = {
          type: 'bar',
          data: data,
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      position: 'top',
                  },
                  title: {
                      display: true,
                      text: '월별 제품 판매량 (누적)'
                  }
              },
              scales: {
                  x: {
                      stacked: true,
                  },
                  y: {
                      stacked: true
                  }
              }
          },
          plugins: [stackedBarTotalPlugin]
      };

      // 차트 생성
      let myChart=this._shadowRoot.getElementById('myChart').getContext('2d');
      
      this.chartjs = new Chart(myChart, config);
    }
  }

  customElements.define('com-sap-sac-stacekd-dottedline-between-bar', Main)
})()
