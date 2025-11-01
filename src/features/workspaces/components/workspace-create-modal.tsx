"use client";
import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "./workspace-create-form";

export const CreateWorkspaceModal = () => {
  return (
    <ResponsiveModal open={true} onOpenChange={() => {}}>
      <CreateWorkspaceForm />
    </ResponsiveModal>
  );
};
