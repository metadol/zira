import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

interface UseGetProjectProps {
    projectId: string;
}

export const useGetProjectById = ({ projectId }: UseGetProjectProps) => {
    const query = useQuery({
        queryKey: ["workspace", projectId],
        queryFn: async () => {
            const response = await client.api.projects[":projectId"].$get({
                param: { projectId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch the workspace.");
            }

            const { data } = await response.json();

            return data;
        },
    });

    return query;
};