import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

/**
 * useCurrent hook to fetch current user data from the backend.
 * If the fetch fails, it returns null.
 * If the fetch succeeds, it returns the current user data.
 * The data is cached by react-query, so subsequent calls will return the cached data.
 * The cache is invalidated when the user logs out, so the next call will fetch the data again.
 * @returns {Promise<null | User>} The promise resolves to null if the fetch fails, or to the current user data if the fetch succeeds.
 */
export const useCurrent = () => { 
    return useQuery({
        queryKey: ['current'],
        queryFn: async () => {
            const response = await (client as any).api.auth.current['$get'](); //rpc in action

            if (!response.ok) {
                return null
            }

            const { data } = await response.json();

            return data
        }
    })
}