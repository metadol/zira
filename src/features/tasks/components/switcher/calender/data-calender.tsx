import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";

import { Task } from "@/types";

interface DataCalenderProps {
  data: Task[];
}

export const DataCalender = ({ data }: DataCalenderProps) => {
  return (
    <div>
      <h2>Data Calendar</h2>

      {JSON.stringify(data)}
    </div>
  );
};
