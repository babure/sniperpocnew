import React, { useState, useEffect } from "react";
import {
  Table,
  IconButton,
  Tooltip,
  Whisper,
  Checkbox,
  Button,
  Pagination,
} from "rsuite";
import { ExpandOutline, CollaspedOutline } from "@rsuite/icons";
import ModalComponent from "../IncidentModal";
import AlertDistribution from "../graphs/AlertDistributionChart";
import HeatChart from "../graphs/HeatChart";

export default function App({ parentIncidentData, startTime, endTime }) {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [showAlerts, setShowAlerts] = useState(false);

  let checked = false;
  let indeterminate = false;

  const { Column, HeaderCell, Cell } = Table;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const ExpandCell = ({ rowData, expandedRowKeys, onChange, ...props }) => (
    <Cell {...props} style={{ padding: 5 }}>
      <IconButton
        appearance="subtle"
        onClick={() => {
          onChange(rowData);
        }}
        icon={
          expandedRowKeys.some((key) => key === rowData.id) ? (
            <CollaspedOutline />
          ) : (
            <ExpandOutline />
          )
        }
      />
    </Cell>
  );

  const renderChildTable = (rowData) => {
    const data = [
      {
        incidentName: "Incident 1",
        serverName: "Server A",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        rawCount: 5,
        alertType: "CPU",
      },
      {
        incidentName: "Incident 2",
        serverName: "Server B",
        startTime: "12:00 PM",
        endTime: "1:00 PM",
        rawCount: 8,
        alertType: "Memory",
      },
      {
        incidentName: "Incident 1",
        serverName: "Server A",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        rawCount: 5,
        alertType: "CPU",
      },
      {
        incidentName: "Incident 2",
        serverName: "Server B",
        startTime: "12:00 PM",
        endTime: "1:00 PM",
        rawCount: 8,
        alertType: "Memory",
      },
      {
        incidentName: "Incident 1",
        serverName: "Server A",
        startTime: "10:00 AM",
        endTime: "11:00 AM",
        rawCount: 5,
        alertType: "CPU",
      },
      {
        incidentName: "Incident 2",
        serverName: "Server B",
        startTime: "12:00 PM",
        endTime: "1:00 PM",
        rawCount: 8,
        alertType: "Memory",
      },
    ];

    return (
      <>
        <Table
          height={150}
          data={data}
          rowKey="incidentName"
          headerHeight={40}
          shouldUpdateScroll={true}
        >
          <Column flexGrow={1}>
            <HeaderCell>Incident</HeaderCell>
            <Cell dataKey="incidentName" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Server</HeaderCell>
            <Cell dataKey="serverName" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Start Time</HeaderCell>
            <Cell dataKey="startTime" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>End Time</HeaderCell>
            <Cell dataKey="endTime" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Raw Count</HeaderCell>
            <Cell dataKey="rawCount" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Alert Type</HeaderCell>
            <Cell dataKey="alertType" />
          </Column>
        </Table>
      </>
    );
  };

  const handleExpanded = (rowData) => {
    if (expandedRowKeys.includes(rowData.id)) {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== rowData.id));
    } else {
      setExpandedRowKeys([rowData.id]);
    }
  };

  const CustomActionCell = ({
    rowData,
    dataKey,
    redirectLinkKey,
    ...props
  }) => {
    const ticketStatus = rowData[dataKey];

    const getStatusTooltip = () => {
      if (ticketStatus !== null) {
        return "Ticket is " + ticketStatus;
      } else {
        return "Create Ticket";
      }
    };

    const getStatusColor = () => {
      if (ticketStatus !== null) {
        return "#1cc912";
      } else {
        return "";
      }
    };

    const handleTicketOnClick = () => {
      if (ticketStatus !== null) {
        window.open(rowData[redirectLinkKey], "_blank");
      } else {
        setModalType("ticket");
        setSelectedRowData(rowData);
        handleOpen();
      }
    };
    return (
      <Cell {...props}>
        <div style={{ display: "flex" }} className="mx">
          <div
            className="icon-example-list mx-1"
            style={{ cursor: "pointer", color: getStatusColor() }}
            onClick={() => {
              handleTicketOnClick();
            }}
          >
            <Whisper
              placement="top"
              trigger="hover"
              speaker={<Tooltip>{getStatusTooltip()}</Tooltip>}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                className="bi bi-ticket-detailed"
                viewBox="0 0 16 16"
              >
                <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5Zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5ZM5 7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6V4.5ZM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5h-13Z" />
              </svg>
            </Whisper>
          </div>
          <div
            className="icon-example-list mx-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setModalType("reccomendation");
              setSelectedRowData(rowData);
              handleOpen();
            }}
          >
            <Whisper
              placement="top"
              trigger="hover"
              speaker={<Tooltip>Reccomdendation</Tooltip>}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                className="bi bi-hand-thumbs-up"
                viewBox="0 0 16 16"
              >
                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
              </svg>
            </Whisper>
          </div>
          <div
            className="icon-example-list mx-1"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setModalType("blacklist");
              setSelectedRowData(rowData);
              handleOpen();
            }}
          >
            <Whisper
              placement="top"
              trigger="hover"
              speaker={<Tooltip>Blacklist</Tooltip>}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                fill="currentColor"
                className="bi bi-flag"
                viewBox="0 0 16 16"
              >
                <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z" />
              </svg>
            </Whisper>
          </div>
        </div>
      </Cell>
    );
  };

  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div style={{ lineHeight: "46px" }}>
        <Checkbox
          value={rowData}
          inline
          onChange={onChange}
          checked={checkedKeys.some((item) => item === rowData)}
        />
      </div>
    </Cell>
  );

  if (
    checkedKeys.length === parentIncidentData.length &&
    parentIncidentData.length !== 0
  ) {
    checked = true;
  } else if (checkedKeys.length === 0) {
    checked = false;
  } else if (
    checkedKeys.length > 0 &&
    checkedKeys.length < parentIncidentData.length
  ) {
    indeterminate = true;
  }

  const getData = () => {
    if (sortColumn && sortType) {
      return parentIncidentData
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
    return parentIncidentData.slice((page - 1) * limit, page * limit);
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

  const handleCheckAll = (value, checked) => {
    const keys = checked ? parentIncidentData.map((item) => item) : [];
    setCheckedKeys(keys);
  };
  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkedKeys, value]
      : checkedKeys.filter((item) => item !== value);
    setCheckedKeys(keys);
  };

  const handleShowAlerts = () => {
    setShowAlerts(true);
  };
  return (
    <>
      <Table
        shouldUpdateScroll={false}
        height={270}
        data={getData()}
        rowKey="id"
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
        expandedRowKeys={expandedRowKeys}
        renderRowExpanded={renderChildTable}
        bordered
        style={{ width: "100%" }}
      >
        <Column width={70} align="center">
          <HeaderCell>#</HeaderCell>
          <ExpandCell
            dataKey="id"
            expandedRowKeys={expandedRowKeys}
            onChange={handleExpanded}
          />
        </Column>

        <Column sortable flexGrow={2} fullText>
          <HeaderCell>Incident</HeaderCell>
          <Cell dataKey="incident" />
        </Column>

        <Column sortable flexGrow={1} fullText>
          <HeaderCell>Server</HeaderCell>
          <Cell dataKey="server" />
        </Column>

        <Column sortable flexGrow={1} fullText>
          <HeaderCell>Alert Type</HeaderCell>
          <Cell dataKey="alertType" />
        </Column>

        <Column sortable flexGrow={1}>
          <HeaderCell>Priority</HeaderCell>
          <Cell dataKey="priority" />
        </Column>

        <Column sortable flexGrow={1}>
          <HeaderCell>Raw Alerts</HeaderCell>
          <Cell dataKey="rawAlerts" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Actions</HeaderCell>
          <CustomActionCell
            dataKey="ticketStatus"
            redirectLinkKey="redirectLink"
          />
        </Column>
        <Column width={50} align="center" flexGrow={1}>
          <HeaderCell style={{ padding: 0 }}>
            <div style={{ lineHeight: "40px" }}>
              <Checkbox
                inline
                checked={checked}
                indeterminate={indeterminate}
                onChange={handleCheckAll}
              />
            </div>
          </HeaderCell>
          <CheckCell
            dataKey="id"
            checkedKeys={checkedKeys}
            onChange={handleCheck}
          />
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
          total={parentIncidentData.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
      <div
        className="my-3"
        style={{ float: "right" }}
        onClick={handleShowAlerts}
      >
        <Button appearance="primary" disabled={checkedKeys.length === 0}>
          Show Alerts and Metrics
        </Button>
      </div>
      {showAlerts && checkedKeys.length !== 0 && (
        <>
          <div className="mt-3">
            <span>Alert Distributions</span>
            <AlertDistribution
              startTime={startTime}
              endTime={endTime}
              rowData={checkedKeys}
            />
          </div>
          <div className="mt-3">
            <span>Heat Chart</span>
            <HeatChart
              startTime={startTime}
              endTime={endTime}
              rowData={checkedKeys}
            />
          </div>
        </>
      )}
      {open && (
        <ModalComponent
          open={open}
          handleClose={handleClose}
          selectedRowData={selectedRowData}
          modalType={modalType}
        />
      )}
    </>
  );
}
