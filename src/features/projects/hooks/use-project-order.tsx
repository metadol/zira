import { useEffect, useMemo, useState } from "react";

export const useProjectOrder = <T extends { $id: string }>(
  items: T[] | undefined,
  storageKey: string
) => {
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      setOrderedIds(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    } catch {
      setOrderedIds([]);
    }
  }, [storageKey]);

  // saved order first, new items go to the end
  const sorted = useMemo(() => {
    const rank = (id: string) => {
      const i = orderedIds.indexOf(id);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    return [...(items ?? [])].sort((a, b) => rank(a.$id) - rank(b.$id));
  }, [items, orderedIds]);

  const reorder = (from: number, to: number) => {
    const ids = sorted.map((item) => item.$id);
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);

    setOrderedIds(ids);
    localStorage.setItem(storageKey, JSON.stringify(ids));
  };

  return { items: sorted, reorder };
};