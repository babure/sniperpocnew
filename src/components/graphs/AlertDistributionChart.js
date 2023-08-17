import React, { startTransition, useEffect, useState } from "react";
import axios from "axios";
import * as echarts from "echarts";

export default function AlertDistributionChart({
  rowData,
  startTime,
  endTime,
}) {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

  const extractedValues = {
    toolNames: [],
    incidents: [],
    alertTypes: [],
    servers: [],
  };

  rowData.forEach((incident) => {
    extractedValues.toolNames.push(incident.toolName);
    extractedValues.incidents.push(incident.incident);
    extractedValues.alertTypes.push(incident.alertType);
    extractedValues.servers.push(incident.server);
  });

  useEffect(() => {
    axios
      .post("http://localhost:8000/alertDistributionGrpah", {
        start_time: startTime,
        end_time: endTime,
        service_names: extractedValues.toolNames,
        incident: extractedValues.incidents,
        alertType: extractedValues.alertTypes,
        server: extractedValues.servers,
      })
      .then((response) => {
        setChartData(response.data.data);
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [startTime, endTime, rowData]);
  useEffect(() => {
    const chartContainer = document.getElementById("chartContainer");
    const chartInstance = echarts.init(chartContainer);

    function renderItem(params, api) {
      const categoryIndex = api.value(0);
      const start = api.coord([api.value(1), categoryIndex]);
      const end = api.coord([api.value(2), categoryIndex]);
      const height = api.size([0, 1])[1] * 0.6;
      const width = end[0] - start[0];
      const rectShape = echarts.graphic.clipRectByRect(
        {
          x: start[0],
          y: start[1] - height / 2,
          width: width,
          height: height,
        },
        {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height,
        }
      );
      return (
        rectShape && {
          type: "rect",
          transition: ["shape"],
          shape: rectShape,
          style: api.style(),
        }
      );
    }

    const option = {
      tooltip: {
        // position: function (pos, params, dom, rect, size) {
        //   var obj = { top: 60 };
        //   obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        //   return obj;
        // },
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
        positionOffset: [10, 0],
        formatter: function (params) {
          var dataItem = chartData[params.dataIndex]; // Get the corresponding data item
          var start = new Date(dataItem.value[1]);
          var end = new Date(dataItem.value[2]);

          var tooltipContent = `
        <div style="width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          <strong>Incident : ${dataItem.incident}</strong>
        </div>
        <div>
          <strong>Server : ${dataItem.server}</strong>
        </div>
        <div> <strong>Alert Type  : ${dataItem.alertType}</strong></div>
        <div><strong>Priority : ${dataItem.priority}</strong></div>
        <div style="width: 300px; white-space: normal; overflow: hidden; text-overflow: ellipsis;">
          Alerts Occurred between
          ${start.toLocaleDateString()} ${start.toLocaleTimeString()} -
          ${end.toLocaleDateString()} ${end.toLocaleTimeString()}
        </div>
      `;

          return tooltipContent;
        },
      },
      title: {
        text: "",
        left: "center",
      },
      dataZoom: [
        {
          type: "slider",
          filterMode: "weakFilter",
          showDataShadow: false,
          top: 400,
          labelFormatter: "",
        },
        {
          type: "inside",
          filterMode: "weakFilter",
        },
      ],
      grid: {
        height: 300,
      },
      xAxis: {
        type: "time",
        show: true,
        name: "Time",
        nameLocation: "middle",
        nameGap: 25,
      },
      yAxis: {
        data: categories,
        show: true,
        axisLabel: {
          show: false,
        },
        name: "Incident",
        nameLocation: "middle",
        nameGap: 45,
      },
      series: [
        {
          type: "custom",
          renderItem: renderItem,

          encode: {
            x: [1, 2],
            y: 0,
          },
          data: chartData,
        },
      ],
    };
    chartInstance.setOption(option);
    return () => {
      chartInstance.dispose();
    };
  }, [chartData]);

  return (
    <div id="chartContainer" style={{ width: "100%", height: "400px" }}></div>
  );
}
