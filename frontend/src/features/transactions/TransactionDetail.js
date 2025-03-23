import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import { useGetTransactionByIdQuery } from './apiSlice';


const TransactionDetail = ({transaction, onClose} ) => {
    console.log(transaction)
  const  transactionId  = transaction.order_id
  const navigate = useNavigate();
  const [deviceId, setDeviceId] = useState('');
  const [column, setColumn] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [transactionTime, setTransactionTime] = useState('');

  const { data: transactionData, isLoading: isTransactionDataLoading, error: transactionDataError} = useGetTransactionByIdQuery(transactionId);


  // Use effect to initialize state when data is loaded
  useEffect(() => {
    if (transactionData) {
      setDeviceId(transactionData.data.product.device_id)
      setColumn(transactionData.data.product.column)
      setName(transactionData.data.product.name)
      setLocation(transactionData.data.product.location)
      setTransactionTime(formatTimestamp(transactionData.data.time.timestamp))
    }
  }, [transactionData]);

  if (isTransactionDataLoading) return <p>Loading...</p>;
  if (transactionDataError) return <p>Error loading device profile: {transactionDataError.message}</p>;

  const formatTimestamp = (unixTimestamp) => {
    if (!unixTimestamp) return null; // Handle null or undefined values
        const date = new Date(unixTimestamp);
        return date.toISOString().replace("T", " ").substring(0, 19); // Convert to "YYYY-MM-DD HH:mm:ss"
    };

  return (
    <div className='w-full'>
      <div className="flex flex-col h-100 rounded-xl">
        
                <table className="table">
                    <tr>
                        <td>Transaction Time</td>
                        <td>:</td>
                        <td>{transactionTime}</td>
                    </tr>
                    <tr>
                        <td>Device ID</td>
                        <td>:</td>
                        <td>{deviceId}</td>
                    </tr>
                    <tr>
                        <td>Column</td>
                        <td>:</td>
                        <td>{column}</td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>:</td>
                        <td>{name}</td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td>:</td>
                        <td>{location}</td>
                    </tr>
                    <tr>
                        <td>Amount</td>
                        <td>:</td>
                        <td>{transactionData.data.payment.amount}</td>
                    </tr>
                    <tr>
                        <td>Nett</td>
                        <td>:</td>
                        <td>{transactionData.data.payment.nett}</td>
                    </tr>
                    <tr>
                        <td>Fee Platform Sharing Revenue</td>
                        <td>:</td>
                        <td>{transactionData.data.payment.fee.platform_sharing_revenue}</td>
                    </tr>
                    <tr>
                        <td>Fee MDR QRIS</td>
                        <td>:</td>
                        <td>{transactionData.data.payment.fee.mdr_qris}</td>
                    </tr>
                    <tr>
                        <td>Transaction Status</td>
                        <td>:</td>
                        <td>{transactionData.data.payment.detail.transaction_status} From {transactionData.data.payment.detail.transaction_time}</td>
                    </tr>
                </table>
          
        
      </div>
        <div className="mt-2 p-2">
        <button
            type="button"
            onClick={() => onClose()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
            Close
        </button>
        </div>
    </div>
  );
};

export default TransactionDetail;