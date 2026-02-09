import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.auth.login['$post']>;
type RequestType = InferRequestType<typeof client.api.auth.login['$post']>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login['$post']({ json }); //rpc in action

      if (!response.ok) throw new Error('Email or Password is incorrect!');

      return await response.json();
    },
    onSuccess: () => {
      router.refresh();

      queryClient.invalidateQueries({
        queryKey: ['current'],
      });
    },
    onError: () => {
      toast.error('Email or Password is incorrect!');
    },
  });

  return mutation;
};

//asdf@r.com : Password@1

// Flow when a user signs in:

// User opens /sign-in.

// SignInPage calls authGuard("public") → checks if already logged in.
// SignInCard renders the signin form → user submits email & password. frontend zod validation using react hook form →
// Hook form onSubmit calls -> mutate from useLogin.
// useLogin().mutate({ json: { email, password } }) is called.
// mutationFn inside useLogin executes the RPC client & sends POST to /api/auth/login.
// Next.js routes it to app/api/[[...routes]]/route.ts.
// route.ts forwards it to auth/server/route.ts.

// Hono middleware:
// Validates request with Zod.
// Calls Appwrite account.createEmailPasswordSession.
// Sets auth cookie.
// Returns JSON response.
// Frontend useMutation gets the response → you can redirect to /.