import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { DatatableProps } from "../../common/data/interface/index";

const Datatable: React.FC<DatatableProps> = ({
  columns,
  dataSource,
  Search,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(true);
  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filtra os dados toda vez que muda o searchText ou dataSource
  useEffect(() => {
    if (searchText) {
      const filtered = dataSource.filter((record) =>
        Object.values(record).some((field) =>
          String(field).toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredDataSource(filtered);
      setCurrentPage(1); // resetar para a página 1 ao filtrar
    } else {
      setFilteredDataSource(dataSource);
    }
  }, [searchText, dataSource]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Configuração de paginação do Ant Design
  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    onChange: (page: number, pageSize?: number) => {
      setCurrentPage(page);
      if (pageSize) setPageSize(pageSize);
    },
    showTotal: (total: number, range: [number, number]) =>
      `Mostrando ${range[0]}-${range[1]} de ${total} itens`,
    locale: { items_per_page: "" },
    nextIcon: (
      <span>
        <i className="fas fa-angle-right" />
      </span>
    ),
    prevIcon: (
      <span>
        <i className="fas fa-angle-left" />
      </span>
    ),
  };

  return (
    <div className="custom-table antd-custom-table">
      {!showSearch ? (
        <Table
          className="table datanew dataTable no-footer"
          columns={columns}
          rowHoverable={false}
          dataSource={dataSource}
          pagination={paginationConfig}
        />
      ) : (
        <>
          <div className="table-search">
            <div className="input-icon mb-3">
              <span className="input-icon-addon">
                <i className="isax isax-search-normal-14" />
              </span>
              <input
                type="search"
                className="form-control form-control-md mb-3 w-auto float-end"
                value={searchText}
                placeholder="Search"
                onChange={(e) => handleSearch(e.target.value)}
                aria-controls="DataTables_Table_0"
              />
            </div>
          </div>
          <Table
            className="table datanew dataTable no-footer"
            columns={columns}
            rowHoverable={false}
            dataSource={filteredDataSource}
            pagination={paginationConfig}
          />
        </>
      )}
    </div>
  );
};

export default Datatable;
