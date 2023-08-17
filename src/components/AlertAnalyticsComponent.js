import React, { useEffect, useState } from "react";
import axios from "axios";
import { Whisper, Tooltip as RsuiteTooltip } from "rsuite";
import InfoOutlineIcon from "@rsuite/icons/InfoOutline";

export default function AlertAnalyticsComponent({ startTime, endTime }) {
  const [reduceRate, setReduceRate] = useState("No Data");
  const [toolData, setToolData] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:8000/noiseReduceandAlertByTool/", {
        service_names: [
          "metricbeat-snipermysql",
          "collectD-avekshaaserver4-B550M-DS3H",
          "metricbeat-sniperapi",
          "metricbeat-avekshaahpc2-System-Product-Name",
        ],
        start_time: startTime,
        end_time: endTime,
      })
      .then((response) => {
        setReduceRate(response.data.reduceRate);
        setToolData(response.data.tool_contributions);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <span>Alert Analytics</span>
      <div style={{ border: "1px solid #ccc", padding: "10px" }}>
        <h6
          className="text-center"
          style={{
            marginBottom: "0",
            paddingBottom: "10px",
            borderBottom: "1px solid #ccc",
          }}
        >
          Noise reduce
          <Whisper
            placement="top"
            trigger="hover"
            speaker={
              <RsuiteTooltip>
                Reflects clarity improvement via conversion of alerts to
                actionable incidents.
              </RsuiteTooltip>
            }
          >
            <InfoOutlineIcon
              style={{
                marginLeft: "5px",
                height: "13px",
                cursor: "pointer",
              }}
            />
          </Whisper>
        </h6>
        <p
          style={{
            color: "green",
            textAlign: "center",
            fontSize: "48px",
            fontWeight: "bold",
          }}
        >
          {reduceRate}%
        </p>
        <h6
          className="text-center"
          style={{ borderBottom: "1px solid #ccc", marginBottom: "10px" }}
        >
          Tools
          <Whisper
            placement="top"
            trigger="hover"
            speaker={
              <RsuiteTooltip>
                Sources of alerts and their distribution.
              </RsuiteTooltip>
            }
          >
            <InfoOutlineIcon
              style={{
                marginLeft: "5px",
                height: "13px",
                cursor: "pointer",
              }}
            />
          </Whisper>
        </h6>
        <div
          className="scroll-container"
          style={{ maxHeight: "100px", overflowY: "auto" }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {toolData.map((item) => (
              <li key={item.tool_name} style={{ padding: "5px 0" }}>
                {item.tool_name}
                <span style={{ float: "right" }}>
                  {item.contribution_percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
