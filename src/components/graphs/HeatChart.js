import { React, useEffect, useState } from "react";
import axios from "axios";
import * as echarts from "echarts";

export default function HeatChart({ rowData, startTime, endTime }) {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        "http://192.168.0.200:7500/apiv1/get_service_metric_co_relation?name=%22[avekshaahpc2-System-Product-Name]%22&start_time=1691713267000&end_time=1691756986000"
      )
      .then((response) => {
        const dataArray = response.data;
        const heatMapdata = dataArray.heat_map_data;
        const extractedKeyNames = Object.keys(heatMapdata);
        const formattedData = [];

        Object.keys(heatMapdata).forEach((outerKey, rowIndex) => {
          Object.keys(heatMapdata[outerKey]).forEach((innerKey, colIndex) => {
            const value = heatMapdata[outerKey][innerKey];
            formattedData.push([rowIndex, colIndex, value]);
          });
        });
        setData(formattedData);
        setCategories(extractedKeyNames);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [startTime, endTime]);

  useEffect(() => {
    const chartContainer = document.getElementById("heatChart");
    const chartInstance = echarts.init(chartContainer);

    const hours = categories;

    const days = categories;
    const chartData = data.map(function (item) {
      return [item[1], item[0], item[2] || "-"];
    });

    const option = {
      tooltip: {
        position: "top",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      grid: {
        height: "50%",
        top: "10%",
      },
      xAxis: {
        type: "category",
        data: hours,
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: days,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: -100,
        max: 100,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "15%",
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          type: "heatmap",
          data: chartData,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    chartInstance.setOption(option);
    return () => {
      chartInstance.dispose();
    };
  }, [data]);

  return <div id="heatChart" style={{ width: "100%", height: "400px" }}></div>;
}
