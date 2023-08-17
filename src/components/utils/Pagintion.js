import { React, useState } from "react";
import { Pagination } from "rsuite";

export default function Pagintion({ tableData }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  return (
    <>
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
    </>
  );
}
