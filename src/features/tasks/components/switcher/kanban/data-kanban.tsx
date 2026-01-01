import { useCallback, useEffect, useState } from "react";

import {
  Draggable,
  Droppable,
  DragDropContext,
  type DropResult,
} from "@hello-pangea/dnd";
import { Task, TaskStatus } from "@/types";
import { KanbanColumnHeader } from "./kanban-column-header";

interface DataKanbanProps {
  data: Task[];
}

type TasksState = {
  [key in TaskStatus]: Task[];
};

const boards: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.BACKLOG,
];

export const DataKanban = ({ data }: DataKanbanProps) => {
  console.log("DATA KANBAN DATA:", data);
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  });

  const onDragEnd = () => {};
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* kanban board header with task count */}
      <div className="flex gap-4 overflow-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
