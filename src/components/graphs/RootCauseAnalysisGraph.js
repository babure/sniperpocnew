import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingChart from "../utils/LoadingChart";
import * as echarts from "echarts";
import SunburstChart from "./SunburstChart";

export default function RootCauseAnalysisGraph({ startTime, endTime }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    axios
      .get(
        "http://34.209.143.125/apiv1/causal_analysis_new_aggregator?duration=1691951400000-1692004920000"
      )
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [startTime, endTime]);

  return (
    <div>
      {/* <LoadingChart /> */}
      <SunburstChart />
    </div>
  );
}
