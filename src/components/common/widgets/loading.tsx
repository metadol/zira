import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export const LoadingLogo = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Image
        src="/favicon-loading.svg"
        alt="Zira Logo"
        width={40}
        height={40}
      />
    </div>
  );
};

export const LoadingTable = ({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}): JSX.Element => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      {/* Table Header */}
      <div className="flex items-center gap-4 border-b border-border bg-muted/40 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 rounded flex-1" />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-4 rounded flex-1"
              style={{ opacity: 1 - rowIndex * 0.1 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
