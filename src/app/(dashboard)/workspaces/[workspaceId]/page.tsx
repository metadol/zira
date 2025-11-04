"use client";

import { authGuard } from "@/lib/auth-guard";

const WorkspacePage = async() => {
  await authGuard("protected");
  
  return (
    <div className="flex flex-col">
      workpace id
    </div>
  );
};

export default WorkspacePage;
