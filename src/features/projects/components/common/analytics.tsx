import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProjectAnalyticsResponseType } from "../../api/client/use-projects-get-analytics";
import { AnalyticsCard } from "@/components/common/widgets/analytics-card";
import { cn } from "@/lib/utils";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  if (!data) return null;

  const analyticsCards = [
    {
      title: "Total Tasks",
      value: data.taskCount,
      delta: data.taskDifference,
    },
    {
      title: "Assigned tasks",
      value: data.assignedTaskCount,
      delta: data.assignedTaskDifference,
    },
    {
      title: "Completed tasks",
      value: data.completedTaskCount,
      delta: data.completedTaskDifference,
    },
    // {
    //   title: "Overdue tasks",
    //   value: data.overdueTaskCount,
    //   delta: data.overdueTaskDifference,
    // },
    {
      title: "Incomplete tasks",
      value: data.incompleteTaskCount,
      delta: data.incompleteTaskDifference,
    },
  ];

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="flex">
        {analyticsCards.map((card, index) => {
          const isLastCard = index === analyticsCards.length - 1;
          return (
            <div
              key={card.title}
              className={cn(
                "flex items-center flex-1",
                !isLastCard && "border-r",
              )}
            >
              <AnalyticsCard
                title={card.title}
                value={card.value}
                delta={card.delta}
                variant={card.delta >= 0 ? "up" : "down"}
              />
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
