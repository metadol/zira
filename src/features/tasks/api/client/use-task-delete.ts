import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.tasks)[":taskId"]['$delete'], 200>;
type RequestType = InferRequestType<(typeof client.api.tasks)[":taskId"]['$delete']>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]['$delete']({ param });

      if (!response.ok) throw new Error('Failed to delete task.');

      return await response.json();
    },
    onSuccess: ({data}) => {
      toast.success('Task deleted.');

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
      console.error('[DELETE_TASK]: ', error);

      toast.error('Failed to delete task.');
    },
  });

  return mutation;
};