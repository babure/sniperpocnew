import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import axios from "axios";

export default function ApexChart({ startTime, endTime }) {
  const chartRef = useRef(null);
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/alertStreamingData/",
          {
            service_names: [
              "metricbeat-snipermysql",
              "collectD-avekshaaserver4-B550M-DS3H",
              "metricbeat-sniperapi",
              "metricbeat-avekshaahpc2-System-Product-Name",
            ],
            start_time: startTime,
            end_time: endTime,
          }
        );
        setSeriesData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startTime, endTime]);

  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom);

    const generateGradientColor = () => {
      const randomValue = () => Math.floor(Math.random() * 256);
      const color = `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
      return color;
    };

    const option = {
      color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
      title: {
        text: "",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: seriesData.map((item) => item.name),
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "time",
          boundaryGap: false,
          axisLabel: {
            formatter: function (value) {
              const date = new Date(value);
              const month = date.getMonth() + 1;
              const day = date.getDate();

              return `${month}/${day}`;
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: seriesData.map((item) => ({
        name: item.name,
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: generateGradientColor(),
        },
        emphasis: {
          focus: "series",
        },
        data: item.data.map((point) => [point.x, point.y]),
      })),
    };
    option.color = option.series.map((serie) => serie.areaStyle.color);

    option && myChart.setOption(option);

    // Clean up the chart instance when the component unmounts
    return () => {
      myChart.dispose();
    };
  }, [seriesData]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }}></div>;
}
