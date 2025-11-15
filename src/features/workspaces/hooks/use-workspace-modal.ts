import { useQueryState, parseAsBoolean } from "nuqs"

export const useCreateWorkSpaceModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-workspace",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: false })
    );

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return { isOpen, setIsOpen, open, close };
}


// nuqs 
// nuqsis a React library that syncs your state with the URL query string — meaning it keeps React state in sync with the browser URL parameters (like ?create-workspace=true).

// So instead of using:

// const [isOpen, setIsOpen] = useState(false);
// (which lives only in memory),
// nuqs stores the same information in the URL, e.g.:
// /dashboard?create-workspace=true