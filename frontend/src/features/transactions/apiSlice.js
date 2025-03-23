import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const transactionAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = transactionAdapter.getInitialState()

export const transactionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTransactionAll: builder.query({ 
            query: ({ method, transaction_status, date, page, perPage }) => ({
                url: '/transaction/all',
                params: { 
                    limit: perPage,
                    page: page,
                    transaction_status: transaction_status, 
                    method: method, 
                    date: date, 
                },
                transformResponse: responseData => {
                    return {
                        page: responseData.page,
                        per_page: responseData.limit,
                        total_pages: responseData.total,
                        total: responseData.total,
                        data: responseData.data.map(transaction => ({
                            order_id: transaction.order_id,
                            name: transaction.name,
                            sku: transaction.sku,
                            amount: transaction.amount,
                            method: transaction.method,
                            transaction_status: transaction.transaction_status,
                            transaction_time: transaction.transaction_time
                        })),
                    };
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Transaction', id: 'LIST' }],
        }),

        getTransactionById: builder.query({
            query: (id) => ({
                url: `/transaction/${id}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            transformResponse: responseData => {
                return {
                    data: responseData.data,
                };
            },
            providesTags: (result, error, arg) => {
                return [{ type: 'Device Profile', id: 'LIST' }];
            }
        }),
        
    }),
})

export const {
    useGetTransactionAllQuery,
    useGetTransactionByIdQuery,
} = transactionApiSlice

