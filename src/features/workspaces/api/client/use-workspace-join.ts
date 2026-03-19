import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['join']['$post'], 200>;
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['join']['$post']>;

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[':workspaceId']['join']['$post']({ param, json });

      if (!response.ok) {
        const error = await response.json() as { error?: string };
        throw new Error(error.error || `Request failed with status ${response.status}`);
      }

      return await response.json();
    },

    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace', data.$id],
        exact: true,
      });
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
};