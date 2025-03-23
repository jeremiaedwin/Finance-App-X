import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus,
    faRightFromBracket
} from "@fortawesome/free-solid-svg-icons"
import { FaBell } from "react-icons/fa";

// Chart Import


import LineChart from '../../components/Chart/LineChart'
import BarChart from '../../components/Chart/BarChart'


// start . to be used with log out button
import { useSendLogoutMutation } from './authApiSlice'
import PostsList from '../posts/PostsList'
import { useGetMethodCountDataQuery, useGetPaymentMethodFeeBarChartQuery, useGetProductRankBarChartQuery, useGetRevenueGrowthLineChartQuery, useGetStatusCountDataQuery } from './dashboardApiSlice'
// end . to be used with log out button

const Welcome = () => {
    // Start . to be used with log out button
    const navigate = useNavigate()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    )

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])
    // End . to be used with log out button

    const { username, displayname, isManager, isAdmin, isSdgFinHubCurator } = useAuth()
    const [filters, setFilters] = useState({ month: '06', year: '2023' });
    const [appliedFilters, setAppliedFilters] = useState({ month: '06', year: '2023' });

    useTitle(`Dashboard`)

    const [date, setDate] = useState('');

    const handleDateChange = (e) => {
        const selectedDate = e.target.value; // Format: YYYY-MM
        const [year, month] = selectedDate.split('-'); // Extract year and month
    
        setDate(selectedDate); 
        setAppliedFilters((prevFilters) => ({
            ...prevFilters,
            month,
            year
        }));
    };
    
    // Get Revenue Growth Line Chart Data
    const {
        data: revenueGrowthData,
        isLoading: isRevenueGrowthDataLoading,
        error: revenueGrowthDataError,
    } = useGetRevenueGrowthLineChartQuery({
        ...appliedFilters 
    });

    // Get Payment Method Fee Bar Chart Data
    const {
        data: paymentMethodFeeData,
        isLoading: isPaymentMethodFeeDataLoading,
        error: paymentMethodFeeDataError,
    } = useGetPaymentMethodFeeBarChartQuery({
        ...appliedFilters 
    });

    // Get Product Rank Bar Chart Data
    const {
        data: productRankData,
        isLoading: isProductRankDataLoading,
        error: productRankDataError,
    } = useGetProductRankBarChartQuery({
        ...appliedFilters 
    });

    const {
        data: methodCountData,
        isLoading: isMethodCountDataLoading,
        error: methodCountDataError,
    } = useGetMethodCountDataQuery({
        ...appliedFilters 
    });


    const {
        data: statusCountData,
        isLoading: isStatusCountDataLoading,
        error: statusCountDataError,
    } = useGetStatusCountDataQuery({
        ...appliedFilters 
    });

    console.log(methodCountData)

    if (isRevenueGrowthDataLoading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    const content = (
        <div className="mx-auto mx-2">
            <div className="border border-gray-400 p-4 mt-5 mb-5 rounded-md">
                <span className="text-2xl font-bold">Finance Dashboard</span> 
            </div>

            <div className="flex flex-col border-solid border-2 bg-white border-gray-300 h-100 p-4 rounded-xl">
                <form >
                {/* Dashboard Periods */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                    Dashboard Periods
                    </label>
                    <input
                        type="month"
                        placeholder='For example, "June, 2024"'
                        value={date}
                        onChange={handleDateChange}
                        className="appearance-none border-solid border-0 border-b border-gray-900 focus:outline-none focus:border-teal-500 focus:ring-0 w-full text-gray-700 leading-tight"
                        required
                    />
                </div>

                </form>

            </div>

            
            <div className="flex flex-wrap">

                <div className='w-1/2 p-2'>
                    <div className='bg-white drop-shadow p-4 rounded-xl'>
                        
                        <span className='text-xl font-semibold text-black'>Transaction Overview</span>
                        
                        <div className='grid grid-cols-3 w-full px-0 lg:px-4 gap-4 mb-4 mt-4'>
                            <div className='bg-green-500 w-full rounded-xl  flex items-center justify-center p-4 h-fit'>
                                <div className="flex items-center justify-center w-full">
                                    <div className='w-1/4 flex items-center justify-center'>
                                        <FaBell size={32} color='#fff'/>
                                    </div>
                                    <div className='w-3/4 text-left p-4'>
                                        <p className='text-lg font-semibold text-white'>Transaction</p>
                                        <span className='text-lg text-white'>34 Transactions</span>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-blue-500 w-full rounded-xl  flex items-center justify-center p-4 h-fit'>
                                <div className="flex items-center justify-center w-full">
                                    <div className='w-1/4 flex items-center justify-center'>
                                        <FaBell size={32} color='#fff'/>
                                    </div>
                                    <div className='w-3/4 text-left p-4'>
                                        <p className='text-lg font-semibold text-white'>Total Income</p>
                                        <span className='text-lg text-white'>$ 456</span>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-teal-500 w-full rounded-xl  flex items-center justify-center p-4 h-fit'>
                                <div className="flex items-center justify-center w-full">
                                    <div className='w-1/4 flex items-center justify-center'>
                                        <FaBell size={32} color='#fff'/>
                                    </div>
                                    <div className='w-3/4 text-left p-4'>
                                        <p className='text-lg font-semibold text-white'>Total Net Income</p>
                                        <span className='text-lg text-white'>$ 421.01343</span>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>    
                </div>

                <div className='w-1/4 p-2'>
                    <div className='bg-white drop-shadow p-4 rounded-xl'>
                        
                        <span className='text-xl font-semibold text-black'>Transaction Status</span>
                

                            
                        <table className="table w-full border-none mt-4 mb-2">
                            <tbody>
                                {Object.entries(statusCountData.statusCounts).map(([status, count]) => (
                                    <tr key={status}>
                                        <td>{status}</td>
                                        <td>:</td>
                                        <td>{count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                           
                    </div>
                </div>

                <div className='w-1/4 p-2'>
                    <div className='bg-white drop-shadow p-4 rounded-xl'>
                        
                        <span className='text-xl font-semibold text-black'>Most Used Payment</span>
                

                            
                        <table className="table w-full border-none mt-4 mb-2">
                            <tbody>
                                {Object.entries(methodCountData.methodCounts).map(([method, count]) => (
                                    <tr key={method}>
                                        <td>{method}</td>
                                        <td>:</td>
                                        <td>{count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                           
                    </div>
                </div>
                
            </div>

            <div className="flex flex-wrap mt-4">
                <div className='grid grid-rows-3 w-full px-0 lg:px-2 gap-4 mb-2'>

                    <div className='bg-white w-full rounded-xl drop-shadow-xl flex items-center justify-center p-4'>
                        <LineChart title={'Revenue Growth'} data={revenueGrowthData} />
                    </div>

                    <div className='bg-white w-full rounded-xl drop-shadow-xl flex items-center justify-center p-4'>
                        <BarChart title={'Payment Method Fee Rank'} data={paymentMethodFeeData} />
                    </div>

                    <div className='bg-white w-full rounded-xl drop-shadow-xl flex items-center justify-center p-4'>
                        <BarChart title={'Most Purchased Product'} data={productRankData} />
                    </div>

                </div>

                
            </div>

        </div>
    )

    return content
}
export default Welcome      