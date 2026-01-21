import { useParams } from "next/navigation";

export const useParamId = (key: string): string => {
  const params = useParams();
  return params?.[key] as string;
};

// Example usage:
// const itemId = useParamId("itemId");
// const userId = useParamId("userId");
// const workspaceId = useParamId("workspaceId");
