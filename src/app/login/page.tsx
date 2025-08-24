"use client";

import Image from "next/image";
import MaterialInput from "@/components/material-input";
import { Button } from "@/components/ui/button";

import { useLoginPage } from "./hooks/useLoginPage";

export default function LoginPage() {
  const { register, handleSubmit, errors, onSubmit, loginMutation } =
    useLoginPage();

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-black relative">
        <Image
          src="/bg-kanban.jpeg"
          alt="Kanban"
          fill
          sizes="500px"
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold">Login</h1>
          <div className="mt-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              className="space-y-4"
            >
              <MaterialInput
                id="username"
                type="text"
                label="Username"
                error={errors.username?.message}
                registerProps={register("username")}
              />

              <MaterialInput
                id="password"
                type="password"
                label="Password"
                error={errors.password?.message}
                registerProps={register("password")}
              />

              <Button
                type="submit"
                className="w-full mt-8"
                disabled={loginMutation.isPending}
                size="lg"
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
