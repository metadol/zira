import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type FieldType = "input" | "textarea" | "select";

interface Option {
  label: string;
  value: string;
}

interface FormFieldFactoryProps {
  control: Control<any>;
  name: string;
  type: FieldType;
  placeholder?: string;
  inputType?: string; // for Input only (text, email, password…)
  options?: Option[]; // for Select only
}

export const FormFieldFactory = ({
  control,
  name,
  type,
  placeholder,
  inputType = "text",
  options = [],
}: FormFieldFactoryProps) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>

            {type === "input" && (
              <Input {...field} type={inputType} placeholder={placeholder} />
            )}

            {type === "textarea" && (
              <Textarea {...field} placeholder={placeholder} />
            )}

            {type === "select" && (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// USAGE
{
  /* <FormFieldFactory
      control={form.control}
      name="email"
      type="input"
      inputType="email"
      placeholder="Enter email address"
    />

    <FormFieldFactory
      control={form.control}
      name="password"
      type="input"
      inputType="password"
      placeholder="Enter password"
    />

    <FormFieldFactory
      control={form.control}
      name="bio"
      type="textarea"
      placeholder="Tell us about yourself"
    /> */
}
