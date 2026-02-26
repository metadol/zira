import { useParamModal } from "@/hooks/use-param-modal";
import { useTaskStatusParam } from "./use-task-status";
import { TaskStatus } from "@/types";

export const useCreateTaskModal = () => {
    const { isOpen, open, setIsOpen } = useParamModal("create-task");
    const { status, setStatus, clear } = useTaskStatusParam();

    const close = () => {
        setIsOpen(false);
        clear();
    };

    const openWithStatus = (s?: TaskStatus) => {
        if (s) setStatus(s);
        open();
    };

    return {
        isOpen,
        open: openWithStatus,
        close,
        setIsOpen: (v: boolean) => (v ? open() : close()),
        status,
    };
};
