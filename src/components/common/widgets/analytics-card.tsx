import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  delta: number;
}

export const AnalyticsCard = ({
  title,
  value,
  variant,
  delta,
}: AnalyticsCardProps) => {
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const deltaColor = variant === "up" ? "text-emerald-500" : "text-red-500";

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>

          <div className="flex items-center gap-x-1">
            <Icon className={cn(iconColor, "size-4")} />
            <span className={cn(deltaColor, "font-medium text-base truncate")}>
              {delta}
            </span>
          </div>
        </div>

        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};
