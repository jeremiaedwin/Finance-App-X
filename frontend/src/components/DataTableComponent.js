import React from 'react';
import DataTable from 'react-data-table-component';

const DataTableComponent = ({ columns, data, isLoading, totalRows, currentPage, perPage, handlePageChange, handlePerRowsChange }) => {
    return (
        <div>
            <DataTable
                columns={columns}
                data={data}
                progressPending={isLoading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                paginationPerPage={perPage}
                paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                highlightOnHover
                striped
            />
        </div>
    );
};

export default DataTableComponent;
