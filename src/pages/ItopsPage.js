import React from "react";
import MyTableComponent from "../components/tables/TableComponent";
import AlertScatterGraph from "../components/graphs/AlertScatterGraph";
import FunnelChart from "../components/graphs/FunnelChart";

export default function ItopsPage({ startTime, endTime }) {
  return (
    <div>
      <h5 className="mt-3 mb-2">Server Table</h5>
      <MyTableComponent
        startTime={startTime.getTime()}
        endTime={endTime.getTime()}
      />
      <div class="row my-3">
        <div class="col-md-6">
          <h5 className="mt-3 mb-2">Normalization</h5>
          <FunnelChart />
        </div>

        <div class="col-md-6">
          <h5 className="mt-3 mb-2">Alert Scatter</h5>
          <AlertScatterGraph
            startTime={startTime.getTime()}
            endTime={endTime.getTime()}
          />
        </div>
      </div>
    </div>
  );
}
