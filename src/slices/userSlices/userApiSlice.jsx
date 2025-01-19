import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // User/Auth endpoints
        register: builder.mutation({
            query: (data) => ({
                url: `/users/register`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        login: builder.mutation({
            query: (data) => ({
                url: `/users/login`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['User']
        }),
        logout: builder.mutation({
            query: () => ({
                url: `/logout`,
                method: 'POST'
            }),
            invalidatesTags: ['User']
        }),
     
    
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation
} = userApiSlice