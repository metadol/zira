import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Control, Form } from "react-hook-form";
import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label?: string;
}

export const FormInput = ({
  control,
  name,
  type = "text",
  placeholder,
  label,
  ...rest
}: FormInputProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} {...rest} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

//name attribute should match with the form schema fields

//HOW TO USE:
{/* <FormInput
  control={form.control}
  label="Workspace Name"
  name="name"
  type="text"
  placeholder="Enter workspace name"
/>; */}
