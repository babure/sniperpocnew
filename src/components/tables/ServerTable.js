import React, { useEffect, useState } from "react";
import { Table, Pagination } from "rsuite";
import "./TableComponent.css";
import { Progress } from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const MyTableComponent = ({ tableData }) => {
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

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
  const ProgressBarCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 6 }}>
      <Progress.Line percent={rowData[dataKey]} strokeColor="#ffc107" />
    </Cell>
  );
  const CompactHeaderCell = (props) => <HeaderCell {...props} />;

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
        style={{ width: "100%" }}
      >
        <Column sortable fullText resizable width={290}>
          <CompactHeaderCell>Server Name</CompactHeaderCell>
          <CompactCell dataKey="serverName" />
        </Column>
        <Column sortable fullText flex={1}>
          <CompactHeaderCell>Raw Alerts</CompactHeaderCell>
          <CompactCell dataKey="rawAlerts" />
        </Column>

        <Column sortable fullText flex={1}>
          <CompactHeaderCell>Incidents</CompactHeaderCell>
          <CompactCell dataKey="incidents" />
        </Column>

        <Column sortable fullText flex={1}>
          <CompactHeaderCell>Critical</CompactHeaderCell>
          <CompactCell dataKey="critical" />
        </Column>

        <Column sortable fullText flex={1}>
          <CompactHeaderCell>Warning</CompactHeaderCell>
          <CompactCell dataKey="warning" />
        </Column>

        <Column sortable fullText width={130}>
          <CompactHeaderCell>CR Rate</CompactHeaderCell>
          <ProgressBarCell dataKey="crRate" />
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
