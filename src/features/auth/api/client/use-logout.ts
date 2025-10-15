import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout['$post'](); //rpc in action

      if (!response.ok) throw new Error('Email or Password is incorrect!');

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ['current'], //refetches the current endpoint to check if it fails after logout so that user automatically gets logged out!
      });
    },
    onError: () => {
      toast.error('Email or Password is incorrect!');
    },
  });

  return mutation;
};

//USAGE 
// const { mutate } = useLogout();

// useLogout() returns the mutation object.
// That object has a mutate property.
// Destructuring extracts mutate so you can call it directly.

// const { mutate, isPending, isSuccess, isError, error } = useLogout();

//👉 It’s automatically provided by React Query’s useMutation() hook. mutate, pending etc...