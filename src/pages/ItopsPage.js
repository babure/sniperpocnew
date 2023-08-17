import { React, useState, useEffect } from "react";
import MyTableComponent from "../components/tables/ServerTable";
import AlertScatterGraph from "../components/graphs/AlertScatterGraph";
import FunnelChart from "../components/graphs/FunnelChart";
import axios from "axios";
import IncidentTable from "../components/tables/IncidentTable";
import AlertAnalyticsComponent from "../components/AlertAnalyticsComponent";
import RootCauseAnalysisGraph from "../components/graphs/RootCauseAnalysisGraph";

export default function ItopsPage({ startTime, endTime }) {
  const [totalAlerts, setTotalAlerts] = useState(null);
  const [totalIncidents, setTotalIncidents] = useState(null);
  const [normalizeValue, setNormalizevalue] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [parentIncidentData, setParentIncidentData] = useState([]);

  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.post("http://localhost:8000/serverTable/", {
        service_names: [
          "metricbeat-snipermysql",
          "collectD-avekshaaserver4-B550M-DS3H",
          "metricbeat-sniperapi",
          "metricbeat-avekshaahpc2-System-Product-Name",
        ],
        start_time: startTime,
        end_time: endTime,
      });
      const sumRawAlerts = response.data.data.reduce(
        (acc, item) => acc + item.rawAlerts,
        0
      );
      const sumTotalIncidents = response.data.data.reduce(
        (acc, item) => acc + item.incidents,
        0
      );
      setTotalAlerts(sumRawAlerts);
      setTotalIncidents(sumTotalIncidents);
      setNormalizevalue(sumRawAlerts - sumTotalIncidents);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const postData = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/incidentTable/",
        {
          start_time: startTime,
          end_time: endTime,
          service_names: [
            "metricbeat-snipermysql",
            "collectD-avekshaaserver4-B550M-DS3H",
            "metricbeat-sniperapi",
            "metricbeat-avekshaahpc2-System-Product-Name",
          ],
        }
      );
      setParentIncidentData(response.data.data);
    } catch (error) {
      setParentIncidentData([]);
    }
  };

  useEffect(() => {
    const getResponseData = async () => {
      const data = await fetchDataFromAPI();
      setTableData(data);
    };
    getResponseData();
    postData();
  }, [startTime, endTime]);

  return (
    <div className="my-3">
      <div className="row my-3">
        <div className="col-md-9">
          <span className="mt-3 mb-2">Server Table</span>
          <MyTableComponent tableData={tableData} />
        </div>
        <div className="col-md-3">
          <AlertAnalyticsComponent startTime={startTime} endTime={endTime} />
        </div>
      </div>
      <div className="row my-3">
        <div className="col-md-6">
          <span className="mt-3 mb-2">Normalization</span>
          {totalAlerts != null &&
            totalIncidents != null &&
            normalizeValue != null && (
              <FunnelChart
                normalizeValue={normalizeValue}
                totalAlerts={totalAlerts}
                totalIncidents={totalIncidents}
              />
            )}
        </div>

        <div className="col-md-6">
          <span className="mt-3 mb-2">Alert Scatter</span>
          <AlertScatterGraph startTime={startTime} endTime={endTime} />
        </div>
      </div>
      <div className="my-3">
        <span>Root Cause Analysis</span>
        <RootCauseAnalysisGraph startTime={startTime} endTime={endTime} />
      </div>
      <div className="my-3">
        <span>Incident Table</span>
        <IncidentTable
          parentIncidentData={parentIncidentData}
          startTime={startTime}
          endTime={endTime}
        />
      </div>
    </div>
  );
}
