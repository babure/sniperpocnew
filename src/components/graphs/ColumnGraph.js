import React, { useEffect } from "react";
import * as echarts from "echarts";

const ColumnGraph = () => {
  useEffect(() => {
    const chartDom = document.getElementById("columnGraph");
    const myChart = echarts.init(chartDom);
    const data = {
      BlacklistedCritical: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      BlacklistedWarning: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      incidentsWarning: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 296, 0, 0, 0, 0, 0,
      ],
      categories: [
        "i-053175aa05b3df8d2",
        "i-0598be859faff9ec4",
        "i-415f5ab6",
        "SERVICE-F319603B668ED057",
        "i-01d438f19972d85b7",
        "SERVICE-E33F8C672575BC82",
        "SERVICE-621BE39CCD820D43",
        "SERVICE-1BE775053172CB11",
        "SERVICE-4974B1FF7824A5AB",
        "SERVICE-227972A8109CF4B8",
        "SERVICE-A73FEE5745857228",
        "i-0cc7ea1c6a3350942",
        "SERVICE-EF2FE1C8D401ED20",
        "SERVICE-D3E7B301B221CE99",
        "i-07ab735ec2b533455",
        "avekshaaserver4-B550M-DS3H",
        "SERVICE-9BC3B0A7239CC0FE",
        "SERVICE-EA4E38A1B7335277",
        "SERVICE-81111F1B76489F06",
        "SERVICE-BD42CF7069125F51",
        "SERVICE-E908543ADFF402A4",
      ],
      rawAlert: [
        13, 268, 1572, 1, 2117, 150, 1, 2360, 196, 1677, 196, 42, 1, 454, 19,
        52402, 53, 1, 151, 59, 825,
      ],
      incidentsCritical: [
        13, 131, 933, 0, 888, 0, 0, 0, 0, 0, 0, 37, 0, 0, 14, 452, 0, 0, 0, 0,
        0,
      ],
    };

    const categories = data.categories;
    const incidentsCritical = data.incidentsCritical;
    const incidentsWarning = data.incidentsWarning;
    const blacklistedCritical = data.BlacklistedCritical;
    const blacklistedWarning = data.BlacklistedWarning;

    const labelOption = {
      show: false,
      formatter: "{c}  {name|{a}}",
      fontSize: 16,
      rich: {
        name: {},
      },
    };

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: [
          "Incidents Critical",
          "Incidents Warning",
          "Blacklisted Critical",
          "Blacklisted Warning",
        ],
      },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
      },
      dataZoom: [
        {
          type: "inside",
          show: true,
          xAxisIndex: [0],
          start: 0,
          end: 100,
        },
      ],
      xAxis: [
        {
          type: "category",
          label: "servers",
          axisTick: { show: false },
          data: categories,
          axisLabel: {
            show: false,
            interval: 0,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Incidents Critical",
          type: "bar",
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: incidentsCritical,
        },
        {
          name: "Incidents Warning",
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: incidentsWarning,
        },
        {
          name: "Blacklisted Critical",
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: blacklistedCritical,
        },
        {
          name: "Blacklisted Warning",
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: blacklistedWarning,
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div id="columnGraph" style={{ width: "100%", height: "400px" }}></div>
  );
};

export default ColumnGraph;
