"use client";

// React
import { useRef } from "react";

// Next.js
import Image from "next/image";

// Icons
import { ImageIcon } from "lucide-react";

// UI Components
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Utils
import { toast } from "sonner";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const VALID_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];

export const ImageUpload = ({
  value,
  onChange,
  disabled,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      toast.error("File is not a valid image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size cannot exceed 1 MB.");
      return;
    }

    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const imageUrl = value instanceof File ? URL.createObjectURL(value) : value;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-5">
        {imageUrl ? (
          <div className="relative size-[72px] overflow-hidden rounded-md">
            <Image
              src={imageUrl}
              alt="Workspace Logo"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <Avatar className="size-[72px]">
            <AvatarFallback>
              <ImageIcon className="size-[36px] text-neutral-400" />
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col">
          <p className="text-sm">Workspace Icon</p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, or JPEG, max 1MB
          </p>

          <input
            type="file"
            className="hidden"
            onChange={handleImageChange}
            accept=".jpg, .png, .jpeg"
            ref={inputRef}
            disabled={disabled}
          />

          {value ? (
            <Button
              type="button"
              disabled={disabled}
              variant="destructive"
              size="xs"
              className="mt-2 w-fit"
              onClick={handleRemove}
            >
              Remove Image
            </Button>
          ) : (
            <Button
              type="button"
              disabled={disabled}
              variant="tertiary"
              size="xs"
              className="mt-2 w-fit"
              onClick={() => inputRef.current?.click()}
            >
              Upload Image
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
