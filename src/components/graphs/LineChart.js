import { React, useRef, useEffect } from "react";
import * as echarts from "echarts";

export default function LineChart() {
  const chartRef = useRef(null);
  const data = [];
  for (let i = 0; i < 5; ++i) {
    data.push(Math.round(Math.random() * 200));
  }

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);
    var option = {
      xAxis: {
        max: "dataMax",
      },
      yAxis: {
        type: "category",
        data: ["A", "B", "C", "D", "E"],
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: 2,
      },
      series: [
        {
          realtimeSort: true,
          name: "X",
          type: "bar",
          data: data,
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
          },
        },
      ],
      legend: {
        show: true,
      },
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);
  return <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>;
}
