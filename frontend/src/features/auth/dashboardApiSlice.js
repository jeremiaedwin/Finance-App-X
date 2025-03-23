import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const dashboardAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = dashboardAdapter.getInitialState()

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRevenueGrowthLineChart: builder.query({ 
            query: ({ month, year}) => ({
                url: '/dashboard/revenue-growth-chart',
                params: { 
                    month: month, 
                    year: year, 
                },
                transformResponse: responseData => 
                    responseData.map(revenue => ({
                        x: revenue.x,
                        y: revenue.y,
                    })),
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Revenue', id: 'LIST' }],
        }),

        getPaymentMethodFeeBarChart: builder.query({ 
            query: ({ month, year}) => ({
                url: '/dashboard/payment-method-fee-rank',
                params: { 
                    month: month, 
                    year: year, 
                },
                transformResponse: responseData => 
                    responseData.map(revenue => ({
                        x: revenue.x,
                        y: revenue.y,
                    })),
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Revenue', id: 'LIST' }],
        }),

        getProductRankBarChart: builder.query({ 
            query: ({ month, year}) => ({
                url: '/dashboard/product-amount-rank',
                params: { 
                    month: month, 
                    year: year, 
                },
                transformResponse: responseData => 
                    responseData.map(revenue => ({
                        x: revenue.x,
                        y: revenue.y,
                    })),
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Revenue', id: 'LIST' }],
        }),

        getMethodCountData: builder.query({ 
            query: ({ month, year}) => ({
                url: '/dashboard/transaction-method',
                params: { 
                    month: month, 
                    year: year, 
                },
                transformResponse: responseData => {
                    return {
                        data: responseData.methodCounts,
                    };
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Revenue', id: 'LIST' }],
        }),

        getStatusCountData: builder.query({ 
            query: ({ month, year}) => ({
                url: '/dashboard/transaction-status',
                params: { 
                    month: month, 
                    year: year, 
                },
                transformResponse: responseData => {
                    return {
                        data: responseData.statusCounts,
                    };
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Revenue', id: 'LIST' }],
        }),
        
    }),
})

export const {
    useGetRevenueGrowthLineChartQuery,
    useGetPaymentMethodFeeBarChartQuery,
    useGetProductRankBarChartQuery,
    useGetMethodCountDataQuery,
    useGetStatusCountDataQuery,
} = dashboardApiSlice

