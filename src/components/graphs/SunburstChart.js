import React, { useEffect } from "react";
import * as echarts from "echarts";

const SunburstChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById("sunburst");
    const myChart = echarts.init(chartDom);

    const rawData = {
      chart: {
        rca_data: [
          {
            max: 92.38,
            children: [
              {
                server: "avekshaaserver4-B550M-DS3H",
                count: 41.02,
                name: "wait",
              },
              {
                server: "avekshaaserver4-B550M-DS3H",
                count: 34.81,
                name: "system",
              },
              {
                server: "avekshaaserver4-B550M-DS3H",
                count: 16.39,
                name: "user",
              },
              {
                server: "avekshaaserver4-B550M-DS3H",
                count: 7.49,
                name: "softirq",
              },
              {
                server: "avekshaaserver4-B550M-DS3H",
                count: 0.29,
                name: "nice",
              },
            ],
            name: "cpu",
            count: 92.375,
          },
          {
            max: 1.97,
            children: [
              {
                server: "i-01d438f19972d85b7",
                count: 76.19,
                name: "CPUUtilization",
              },
              {
                server: "i-415f5ab6",
                count: 23.02,
                name: "CPUUtilization",
              },
              {
                server: "i-07ab735ec2b533455",
                count: 0.79,
                name: "CPUUtilization",
              },
            ],
            name: "CPUUtilization",
            count: 1.969,
          },
          {
            max: 1.56,
            children: [
              {
                server: "i-01d438f19972d85b7",
                count: 89,
                name: "NetworkIn",
              },
              {
                server: "i-415f5ab6",
                count: 11,
                name: "NetworkIn",
              },
            ],
            name: "NetworkIn",
            count: 1.562,
          },
          {
            max: 4.09,
            children: [
              {
                server: "SERVICE-81111F1B76489F06",
                count: 75.57,
                name: "failure rate",
              },
              {
                server: "SERVICE-6C6A018CD9D075A8",
                count: 8.78,
                name: "failure rate",
              },
              {
                server: "SERVICE-F319603B668ED057",
                count: 7.25,
                name: "failure rate",
              },
              {
                server: "SERVICE-E908543ADFF402A4",
                count: 5.34,
                name: "failure rate",
              },
              {
                server: "SERVICE-BD42CF7069125F51",
                count: 3.05,
                name: "failure rate",
              },
            ],
            name: "failure rate",
            count: 4.094,
          },
        ],
      },
    };

    const formattedData = {
      name: "chart",
      children: rawData.chart.rca_data.map((categoryData) => ({
        name: categoryData.name,
        children: categoryData.children.map((serverData) => ({
          name: serverData.server,
          value: parseInt(serverData.count),
        })),
      })),
    };

    const option = {
      visualMap: {
        type: "continuous",
        min: 0,
        max: 100,
        inRange: {
          color: ["#2F93C8", "#AEC48F", "#FFDB5C", "#F98862"],
        },
      },
      series: {
        type: "sunburst",
        data: [formattedData],
        radius: [0, "90%"],
        label: {
          rotate: "radial",
        },
      },
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div id="sunburst" style={{ width: "50%", height: "400px" }}></div>;
};

export default SunburstChart;
