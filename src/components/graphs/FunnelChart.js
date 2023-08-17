import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

export default function FunnelChart({
  normalizeValue,
  totalAlerts,
  totalIncidents,
}) {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: "",
      },
      tooltip: {
        trigger: "item",
        formatter: "{b} : {c}",
      },
      toolbox: {
        feature: {},
      },
      legend: {
        type: "scroll",
        data: ["Alerts", "Incidents", "Normalization"],
      },
      series: [
        {
          name: "Funnel",
          type: "funnel",
          left: "10%",
          top: 60,
          bottom: 60,
          width: "80%",
          min: 0,
          max: 100,
          minSize: "0%",
          maxSize: "100%",
          sort: "descending",
          gap: 2,
          label: {
            show: true,
            position: "inside",
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: "solid",
            },
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: [
            { value: totalAlerts, name: "Alerts" },
            { value: normalizeValue, name: "Normalization" },
            { value: totalIncidents, name: "Incidents" },
          ],
        },
      ],
    };

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>;
}
