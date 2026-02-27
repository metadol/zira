import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

interface UseGetProjectProps {
    projectId: string;
}

export const useGetProjectById = ({ projectId }: UseGetProjectProps) => {
    const query = useQuery({
        // key needs to align with what mutations invalidate
        queryKey: ["project", projectId],
        queryFn: async () => {
            const response = await client.api.projects[":projectId"].$get({
                param: { projectId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch the project.");
            }

            const { data } = await response.json();

            return data;
        },
    });

    return query;
};