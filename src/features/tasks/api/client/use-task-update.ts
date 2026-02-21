import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';
import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[':taskId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[':taskId']['$patch']>;

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[':taskId']['$patch']({ json, param });

            if (!response.ok) throw new Error('Failed to update task.');

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Task updated.');
            queryClient.invalidateQueries({
                queryKey: ['tasks'],
            });
            queryClient.invalidateQueries({
                queryKey: ['workspace-analytics', data.workspaceid],
                exact: true, // only invalidate the specific workspace id analytics query
            });
            queryClient.invalidateQueries({
                queryKey: ['project-analytics', data.projectid],
                exact: true,
            });
            queryClient.invalidateQueries({
                queryKey: ['tasks', data.workspaceid],
                exact: false,
            });
            queryClient.invalidateQueries({
                queryKey: ['task', data.$id],
                exact: true, // only invalidate the specific task so when click edit modal again it will have the updated data
            });
        },
        onError: (error) => {
            console.error('[UPDATE_TASK]: ', error);

            toast.error('Failed to update task.');
        },
    });

    return mutation;
};