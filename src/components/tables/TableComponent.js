import React, { useEffect, useState } from "react";
import { Table, Pagination } from "rsuite";
import axios from "axios";
import "./TableComponent.css";
import { Progress } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const MyTableComponent = ({ startTime, endTime }) => {
  const [tableData, setTableData] = useState([]);
  const [sortColumn, setSortColumn] = React.useState();
  const [sortType, setSortType] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(4);

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
      return response.data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  useEffect(() => {
    const getData = async () => {
      const data = await fetchDataFromAPI();
      setTableData(data);
    };
    getData();
  }, [startTime, endTime]);

  const getData = () => {
    if (sortColumn && sortType) {
      return tableData
        .sort((a, b) => {
          let x = a[sortColumn];
          let y = b[sortColumn];
          if (typeof x === "string") {
            x = x.charCodeAt();
          }
          if (typeof y === "string") {
            y = y.charCodeAt();
          }
          if (sortType === "asc") {
            return x - y;
          } else {
            return y - x;
          }
        })
        .slice((page - 1) * limit, page * limit);
    }
    return tableData.slice((page - 1) * limit, page * limit);
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setLoading(false);
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const CompactCell = (props) => <Cell {...props} style={{ padding: 6 }} />;
  const CompactHeaderCell = (props) => (
    <HeaderCell {...props} style={{ fontSize: 18 }} />
  );

  return (
    <div style={{ width: "100%" }}>
      <Table
        data={getData()}
        height={225}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        bordered
        width={"100%"}
        style={{ fontSize: 16 }}
      >
        <Column sortable fullText resizable width={350}>
          <CompactHeaderCell>Server Name</CompactHeaderCell>
          <CompactCell dataKey="serverName" />
        </Column>
        <Column sortable fullText width={150}>
          <CompactHeaderCell>Raw Alerts</CompactHeaderCell>
          <CompactCell dataKey="rawAlerts" />
        </Column>

        <Column sortable fullText width={150}>
          <CompactHeaderCell>Incidents</CompactHeaderCell>
          <CompactCell dataKey="incidents" />
        </Column>

        <Column sortable fullText width={150}>
          <CompactHeaderCell>Critical</CompactHeaderCell>
          <CompactCell dataKey="critical" />
        </Column>

        <Column sortable fullText width={150}>
          <CompactHeaderCell>Warning</CompactHeaderCell>
          <CompactCell dataKey="warning" />
        </Column>

        <Column sortable fullText width={150}>
          <CompactHeaderCell>CR Rate</CompactHeaderCell>
          <CompactCell dataKey="crRate">
            <Progress.Line percent={30} strokeColor="#ffc107" />
          </CompactCell>
        </Column>
      </Table>

      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["total", "-", "|", "pager", "skip"]}
          total={tableData.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  );
};

export default MyTableComponent;
