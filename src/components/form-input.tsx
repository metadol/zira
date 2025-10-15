import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
}

export const FormInput = ({
  control,
  name,
  type = "text",
  placeholder,
  ...rest // extra props captured here
}: FormInputProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} {...rest} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
