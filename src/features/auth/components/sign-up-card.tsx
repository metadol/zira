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
import { OAuthButton } from "./oauth-button";
import { useState } from "react";

type RegisterFormValues = z.infer<typeof registerSchema>;

export const SignUpCard = () => {
  const { mutate, isPending: isSignUpPending } = useRegister();
  const [isOAuthPending, setIsOAuthPending] = useState(false);

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

  const isPending = isSignUpPending || isOAuthPending;

  return (
    <Card className="w-full h-full md:w-[486px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center p-7 text-center">
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
        <OAuthButton disabled={isPending} onLoading={setIsOAuthPending} />
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
