import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const reportAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = reportAdapter.getInitialState()

export const reportApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTransactionAll: builder.query({ 
            query: ({ month, year }) => ({
                url: '/report/',
                params: { 
                    month: month, 
                    year: year, 
                },
                transformResponse: responseData => {
                    
                },
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError;
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Report', id: 'LIST' }],
        }),

        
        
    }),
})

export const {
    useGetTransactionAllQuery,
} = reportApiSlice

