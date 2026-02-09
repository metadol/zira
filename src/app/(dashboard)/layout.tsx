import { Navbar } from "@/components/layout/navbar/navbar";
import { Sidebar } from "@/components/layout/sidebar/sidebar";

import { EditTaskModal } from "@/features/tasks/components/modals/task-edit-modal";
import { CreateTaskModal } from "@/features/tasks/components/modals/task-create-modal";
import { CreateProjectModal } from "@/features/projects/components/modals/project-create-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/modals/workspace-create-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      <EditTaskModal />
      <CreateTaskModal />
      <CreateProjectModal />
      <CreateWorkspaceModal />

      <div className="flex w-full h-full ">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto ">
          <Sidebar />
        </div>

        <div className="lg:pl-[264px] w-full h-full">
          <div className="mx-auto max-w-screen-2xl h-full ">
            <Navbar />
            <main className="flex flex-col h-full py-8 px-6 ">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
