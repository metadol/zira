import { parseAsString, useQueryState } from "nuqs";

export const useParamIdModal = (param: string) => {
  const [id, setId] = useQueryState(param, parseAsString);

  const open = (entityId: string) => setId(entityId);
  const close = () => setId(null);

  return {
    id,
    setId,
    open,
    close,
  };
};

// Example usage:
// const { id, open, close } = useParamIdModal("itemId");
