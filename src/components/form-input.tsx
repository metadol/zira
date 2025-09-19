import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";

interface FormInputProps {
  control: Control<any>;
  name: string;
  type?: string;
  placeholder?: string;
}

export const FormInput = ({ control, name, type = "text", placeholder }: FormInputProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
