import { useQueryState, parseAsBoolean } from "nuqs";

export const useParamModal = (param: string) => {
  const [isOpen, setIsOpen] = useQueryState(
    param,
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, setIsOpen, open, close };
};
