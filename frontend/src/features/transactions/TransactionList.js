import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import { useGetTransactionAllQuery } from './apiSlice';
import TransactionDetail from './TransactionDetail';


const TransactionList = () => {
  const navigate = useNavigate();
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [filters, setFilters] = useState({
      transaction_status: '',
      method: '',
      date: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const { refetch } = useGetTransactionAllQuery({ page: currentPage, perPage, ...filters });

  const {
    data: transactionData,
    isLoading,
    isSuccess,
    error
  } = useGetTransactionAllQuery({ page: currentPage, perPage, ...filters });

  const transactions = transactionData?.data || [];
  const totalRows = transactionData?.total || 0;

  const handleFilterChange = (e) => {
    const { name, value } = e.target; 
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value, 
    }));
};

useEffect(() => {
    refetch();
}, [filters, currentPage, perPage]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    refetch()
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle rows per page change
  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const columns = [
    {
        name: 'No.',
        selector: (row, index) => (currentPage - 1) * perPage + index + 1,
        sortable: false,
        width: '5%',
        style: { textAlign: 'center' },
    },
    {
        name: 'Order ID',
        selector: row => row.order_id,
        sortable: true,
    },
    {
        name: 'Name',
        selector: row => row.name,
        sortable: true,
    },
    {
        name: 'SKU',
        selector: row => row.sku,
        sortable: true,
    },
    {
        name: 'Amount',
        selector: row => row.amount,
        sortable: true,
    },
    {
        name: 'Method',
        selector: row => row.method,
        sortable: true,
    },
    {
        name: 'Status',
        selector: row => row.transaction_status,
        sortable: true,
    },
    {
        name: 'Created At',
        selector: (row) => row.transaction_time,
        sortable: true,
    },
    {
      name: 'Actions',
      width: '20%',
      cell: row => (
        <div className="flex gap-2">
          <button
            onClick={() => openDetailModal(row) }
            className="bg-teal-500 text-white rounded px-4 py-2"
          >
            Detail
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  const openDetailModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalDetailOpen(true);
  };

  return (
    <div>
      <div className="border border-gray-400 p-4 mt-5 mb-5 rounded-md">
          <span className="text-2xl font-bold">Transaction List</span> 
      </div>
      <div className="flex flex-col border-solid border-2 bg-white border-gray-300 h-100 p-4 rounded-xl">
        <div className=" mt-4 mb-2 px-4 p-2 w-full">
            <form onSubmit={handleFilterSubmit} className="flex items-center gap-4 mt-4 justify-end">

                <div className=''>
                    <label className="text-sm text-semibold mr-4 ">Status</label>
                    <select
                        name="transaction_status"
                        className="bg-white text-gray-900 text-sm p-2.5 border-solid border-0 border-b border-gray-900"
                        value={filters.transaction_status}
                        onChange={handleFilterChange}>
                            <option value="">Select Status</option>
                            <option value="settlement">settlement</option>
                            <option value="cancelled">cancelled</option>
                            <option value="refunded">refunded</option>
                            <option value="expired">expired</option>
                    </select>
                </div>

                <div className=''>
                    <label className="text-sm text-semibold mr-4 ">Method</label>
                    <select
                            name="method"
                            className="bg-white method-gray-900 text-sm p-2.5 border-solid border-0 border-b border-gray-900"
                            value={filters.method}
                            onChange={handleFilterChange}>
                                <option value="">Select Method</option>
                                <option value="CASH">CASH</option>
                                <option value="QRIS-CUSTOM-MIDTRANS">QRIS-CUSTOM-MIDTRANS</option>
                                <option value="QRIS-MIDTRANS">QRIS-MIDTRANS</option>
                                <option value="QRIS-MIDTRANS-PARTNER">QRIS-MIDTRANS-PARTNER</option>
                                <option value="QRIS-BANKNOBU">QRIS-BANKNOBU</option>
                                <option value="method">Other Method</option>
                    </select>
                </div>

                <div className=''>
                    <label className="text-sm text-semibold mr-4 ">Date</label>
                    <input
                        type="date"
                        name='date'
                        placeholder='For example, "11 June, 2024"'
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="bg-white method-gray-900 text-sm p-2.5 border-solid border-0 border-b border-gray-900"
                        
                    />
                </div>
                {/* <button type="submit" className="bg-blue-500 text-white drop-shadow-xl p-2">Apply</button> */}
            </form>
        </div>

        {/* DataTable */}
          <DataTable
            columns={columns}
            data={transactions}
            progressPending={isLoading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            highlightOnHover
            pointerOnHover
            striped
            persistTableHead
            responsive
          />

        {/* Detail Modal */}
        {isModalDetailOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
              <h2 className="text-lg font-bold mb-4">Transaction Detail</h2>
              <TransactionDetail
                transaction={selectedTransaction} 
                onClose={() => {setIsModalDetailOpen(false);refetch();}} 
              />
            </div>
          </div>
          
        )}

      </div>
    </div>
  );
};

export default TransactionList;