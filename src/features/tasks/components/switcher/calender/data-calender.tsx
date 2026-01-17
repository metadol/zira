import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calender.css";

import { Task } from "@/types";
import { useState } from "react";
import { CalenderCard } from "./calender-card";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DataCalenderProps {
  data: Task[];
}
interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="mb-4 flex w-full items-center justify-center gap-x-2 lg:w-auto lg:justify-start">
      <Button
        title="Previous Month"
        onClick={() => onNavigate("PREV")}
        variant="secondary"
        size="icon"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex h-8 w-full items-center justify-center rounded-md border border-input px-3 py-2 lg:w-auto">
        <CalendarIcon className="mr-2 size-4" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>

      <Button
        title="Next Month"
        onClick={() => onNavigate("NEXT")}
        variant="secondary"
        size="icon"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export const DataCalender = ({ data }: DataCalenderProps) => {
  // Determine the initial month to display based on the first task's due date
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].duedate) : new Date()
  );

  //Transforming your Task[] data into the format the calendar understands.
  const events = data.map((task) => ({
    start: new Date(task.duedate),
    end: new Date(task.duedate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") setValue(subMonths(value, 1));
    else if (action === "NEXT") setValue(addMonths(value, 1));
    else if (action === "TODAY") setValue(new Date());
  };

  return (
    <Calendar
      toolbar
      date={value}
      showAllEvents
      events={events}
      views={["month"]}
      className="h-full"
      defaultView="month"
      localizer={localizer}
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <CalenderCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
};
