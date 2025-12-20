import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { TaskStatus } from '@/types';

/**
 * Hook to fetch task filters from the URL query string.
 */
export const useTaskFilters = () => {
    return useQueryStates({
        projectId: parseAsString,
        status: parseAsStringEnum(Object.values(TaskStatus)),
        assigneeId: parseAsString,
        search: parseAsString,
        dueDate: parseAsString,
    });
};

// useQueryStates(...) returns a tuple:

// const [state, setState] = useQueryStates(...)


// So your hook is effectively returning:

// [
//   filters,     // current query values
//   setFilters   // function to update query values
// ]