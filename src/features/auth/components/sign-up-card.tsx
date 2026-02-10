"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { zodResolver } from "@hookform/resolvers/zod";

import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/common/forms/form-input";
import { registerSchema } from "../schemas";
import { useRegister } from "../api/client/use-register";
import { Logo } from "@/components/common/widgets/zira-logo";

type RegisterFormValues = z.infer<typeof registerSchema>;

export const SignUpCard = () => {
  const { mutate, isPending } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log(data);
    mutate({ json: data });
  };

  return (
    <Card className="w-full h-full md:w-[486px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        {/* <CardTitle className="text-2xl">Sign Up</CardTitle> */}
        {/* <CardDescription>
          By signing up you agree to our{" "}
          <Link href={"/terms"} className="text-blue-500">
            Privacy Policy
          </Link>{" "}
          &{" "}
          <Link href={"/privacy"} className="text-blue-500">
            Terms of Service
          </Link>
        </CardDescription> */}
        <Logo />
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormInput
              control={form.control}
              name="name"
              type="text"
              placeholder="Enter your name"
            />
            <FormInput
              control={form.control}
              name="email"
              type="email"
              placeholder="Enter email address"
            />
            <FormInput
              control={form.control}
              name="password"
              type="password"
              placeholder="Enter password"
            />
            <Button disabled={isPending} size={"lg"} className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          disabled={isPending}
          variant={"secondary"}
          size={"lg"}
          className="w-full"
        >
          <FcGoogle className="mr-2 size-6" />
          {/* Login with google */}
        </Button>
        {/* <Button
          disabled={false}
          variant={"secondary"}
          size={"lg"}
          className="w-full"
        >
          <FaGithub className="mr-2 size-6" />
          Login with github
        </Button> */}
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex justify-center items-center">
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-600 ">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
