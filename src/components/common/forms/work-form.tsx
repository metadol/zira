"use client";

// Libraries
import { z } from "zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { FormInput } from "@/components/common/forms/form-input";
import { ImageUpload } from "@/components/common/widgets/image-upload";
import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";

// Utils / Schemas/ Hooks
import { cn } from "@/lib/utils";
 
type FormModule =
  | "create-workspace"
  | "update-workspace"
  | "create-project"
  | "update-project";

interface FormConfig {
  title: string;
  submitLabel: string;
  nameLabel: string;
  namePlaceholder: string;
  showBackButton: boolean;
}

const FORM_CONFIGS: Record<FormModule, FormConfig> = {
  "create-workspace": {
    title: "Create Workspace",
    submitLabel: "Create Workspace",
    nameLabel: "Workspace Name",
    namePlaceholder: "Enter workspace name",
    showBackButton: false,
  },
  "update-workspace": {
    title: "", // Will be set dynamically from entity name
    submitLabel: "Save Changes",
    nameLabel: "Workspace Name",
    namePlaceholder: "Enter workspace name",
    showBackButton: true,
  },
  "create-project": {
    title: "Create Project",
    submitLabel: "Create Project",
    nameLabel: "Project Name",
    namePlaceholder: "Enter project name",
    showBackButton: false,
  },
  "update-project": {
    title: "", // Will be set dynamically from entity name
    submitLabel: "Save Changes",
    nameLabel: "Project Name",
    namePlaceholder: "Enter project name",
    showBackButton: true,
  },
};

interface FormWrapperProps {
  form: UseFormReturn<any>;
  onSubmit: () => void;
  isPending: boolean;
  module: FormModule;
  onCancel?: () => void;
  onBack?: () => void;
  entityName?: string; // For update forms, pass the current name
}

export function FormWrapper({
  form,
  onSubmit,
  isPending,
  module,
  onCancel,
  onBack,
  entityName,
}: FormWrapperProps) {
  const config = FORM_CONFIGS[module];
  const displayTitle = entityName || config.title;

  return (
    <Card
      className={cn(
        "border-none shadow-none",
        !config.showBackButton && "w-full h-full"
      )}
    >
      <CardHeader
        className={cn(
          "flex p-7",
          config.showBackButton ? "flex-row items-center gap-x-4 space-y-0" : ""
        )}
      >
        {config.showBackButton && onBack && (
          <Button size="sm" variant="secondary" onClick={onBack}>
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </Button>
        )}
        <CardTitle className="text-xl font-bold">{displayTitle}</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="flex flex-col gap-y-4">
              <FormInput
                control={form.control}
                label={config.nameLabel}
                name="name"
                type="text"
                placeholder={config.namePlaceholder}
                disabled={isPending}
              />
              <FormField
                disabled={isPending}
                control={form.control}
                name="image"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                  />
                )}
              />
            </div>

            <DottedSeparator className="py-7" />

            <div className="flex flex-col-reverse xs:flex-row gap-y-2 items-center justify-between">
              <Button
                variant="secondary"
                onClick={onCancel}
                size="lg"
                type="button"
                disabled={isPending}
                className={cn(
                  !onCancel &&
                    config.showBackButton &&
                    "hidden xs:invisible xs:block",
                  !onCancel && !config.showBackButton && "invisible",
                  "w-full xs:w-auto"
                )}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full xs:w-auto"
              >
                {config.submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
