"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DottedSeparator } from "@/components/common/widgets/dotted-seperator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/common/forms/form-input";
import Link from "next/link";
import { loginSchema } from "../schemas";
import { useLogin } from "../api/client/use-login";
import { Logo } from "@/components/common/widgets/zira-logo";
import { useState } from "react";
import { OAuthButton } from "./oauth-button";

type LoginFormValues = z.infer<typeof loginSchema>;

export const SignInCard = () => {
  const { mutate, isPending: isSignInPending } = useLogin();
  const [isOAuthPending, setIsOAuthPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate({ json: data });
  };

  const isPending = isSignInPending || isOAuthPending;

  return (
    <Card className="w-full h-full md:w-[486px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center p-7 text-center">
        <Logo redirect={false} />
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
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
