import React, { useEffect } from "react";
import * as echarts from "echarts";

export default function LoadingChart() {
  useEffect(() => {
    const chartContainer = document.getElementById("loadingChartContainer");
    const chartInstance = echarts.init(chartContainer);

    chartInstance.showLoading("default", {
      text: "Loading...",
      color: "#1a83ff",
      textColor: "#000",
    });

    return () => {
      chartInstance.dispose();
    };
  }, []);

  return (
    <div
      id="loadingChartContainer"
      style={{ width: "100%", height: "400px" }}
    />
  );
}
