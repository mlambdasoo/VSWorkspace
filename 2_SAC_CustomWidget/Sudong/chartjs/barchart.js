const connectBarsWithDashedLinePlugin = {
    id: 'custom',
    afterDatasetsDraw: (chart, args, options) => {
        const { ctx, data, scales: { x, y } } = chart; 
        const datasets = chart.data.datasets;

        

        //const boundaries = [];
        // 각 바의 우측 상단 모서리에서 다음 바의 좌측 상단 모서리로 점선을 그리기
        datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex); // 첫 번째 데이터셋의 메타 정보∂
            const data = meta.data
            //점선
            let previousPixel = null;
            for (let i = 0; i < data.length; i++) {
                if (i < meta.data.length - 1){
                    const currentBar = meta.data[i]; // 현재 바
                    const nextBar = data[i + 1]; // 다음 바
                    const currentRightTopX = currentBar.x + currentBar.width / 2; // 현재 바의 우측 상단 X좌표
                    const currentRightTopY = currentBar.y; // 현재 바의 상단 Y좌표
                    const nextLeftTopX = nextBar.x - nextBar.width / 2; // 다음 바의 좌측 상단 X좌표
                    const nextLeftTopY = nextBar.y; // 다음 바의 상단 Y좌표
        
                    ctx.beginPath();
                    ctx.setLineDash([5, 5]);  // 점선 설정 (5px 간격)
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // 점선 색상
                    ctx.lineWidth = 2;
                    ctx.moveTo(currentRightTopX, currentRightTopY); // 현재 바의 우측 상단 모서리로 이동
                    ctx.lineTo(nextLeftTopX, nextLeftTopY); // 다음 바의 좌측 상단 모서리로 점선 연결
                    ctx.stroke();
                };
                const currentPixel = xScale.getPixelForTick(i);
                if (previousPixel !== null) {
                    const bar = meta.data[i];
                    const barTopY = bar.y; // 막대 상단 Y 좌표
                    const barBottomY = yScale.getPixelForValue(0); // 막대 하단 Y 좌표 (y축 0의 픽셀 값)
                    const barMiddleY = (barTopY + barBottomY) / 2; // 중간 높이 계산

                    const boundary = (previousPixel + currentPixel) / 2;
                    const xPosition = boundary;
                    const yPosition = barMiddleY;
                    console.log(barTopY)
        
                    ctx.save();
                    ctx.fillStyle = 'rgba(255, 26, 104, 1)';
                    ctx.textAlign = 'center'
                    ctx.font = 'bolder 12px Arial';
                    ctx.fillText('Testing', xPosition, yPosition)
                }
                previousPixel = currentPixel; // 현재 픽셀을 다음 반복을 위한 이전 픽셀로 저장
            };

        });
        ctx.restore();  // 이전 상태로 복원
    }
};


const data = {
    labels: ['전년', '당월', '전월'], // X축 레이블
    datasets: [
        {
            categoryPercentage: 1.0,
            barPercentage: 0.4,
            label: 'Dataset 1',
            data: [5883, 7106, 7807],
            backgroundColor: 'rgba(75, 192, 192, 0.5)', // 막대 색상
            stack: 'stack1' // 같은 스택 그룹에 속하도록 설정
        },
        {
            categoryPercentage: 1.0,
            barPercentage: 0.4,
            label: 'Dataset 2',
            data: [3707, 3471, 3318],
            backgroundColor: 'rgba(153, 102, 255, 0.5)', // 막대 색상
            stack: 'stack1' // 같은 스택 그룹에 속하도록 설정
        }
    ]
};

// 옵션 정의
const options = {
    responsive: true,
    scales: {
        x: {
            stacked: true // X축에서 스택형 막대 설정
        },
        y: {
            stacked: true // Y축에서 스택형 막대 설정
        }
    },
    plugins: {
        legend: {
            display: true // 범례 표시
        }
    }
};
/*
const customDataLabelPlugin = {
    id: 'customDataLabelPlugin',
    afterDatasetsDraw: (chart) => {
        const ctx = chart.ctx;
        // x축 스케일 참조
        const xScale = chart.scales['x'];
        const categoryCount = chart.data.labels.length; // 카테고리 수

        // 모든 카테고리의 좌표 구하기
        let previousPixel = null;
        const boundaries = [];
        for (let i = 0; i < categoryCount; i++) {
            const currentPixel = xScale.getPixelForTick(i);
            if (previousPixel !== null) {
                const boundary = (previousPixel + currentPixel) / 2;
                boundaries.push(boundary);
            }
            previousPixel = currentPixel; // 현재 픽셀을 다음 반복을 위한 이전 픽셀로 저장
        };
        const xPositions = boundaries.concat(boundaries);
        for (let i = 0; i< boundaries.length;i++){            
            const xPosition = boundaries[i];
            const yPosition =  120;

            ctx.save();
            ctx.fillStyle = 'rgba(255, 26, 104, 1)';
            ctx.textAlign = 'center'
            ctx.font = 'bolder 12px Arial';
            ctx.fillText('Testing', xPosition, yPosition)
            
        }


    }
};
*/

// 차트 생성
new Chart(document.getElementById('myBarChart').getContext('2d'), {
    type: 'bar',  // 차트 유형
    data: data,   // 차트 데이터
    options: options, // 차트 옵션
    plugins: [connectBarsWithDashedLinePlugin,ChartDataLabels]
});
