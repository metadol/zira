import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { InputHTMLAttributes } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "../widgets/date-picker";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label?: string;
  options?: Array<{ value: string; label: string }>;
}

export const FormInput = ({
  control,
  name,
  type = "text",
  placeholder,
  label,
  options = [],
  ...rest
}: FormInputProps) => {
  const renderField = (field: any) => {
    switch (type) {
      case "select":
        return (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date":
        return <DatePicker {...field} />;

      default:
        return (
          <Input {...field} type={type} placeholder={placeholder} {...rest} />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>{renderField(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
