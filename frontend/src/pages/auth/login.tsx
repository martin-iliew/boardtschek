import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { loginUser } from "@/api/auth/auth";
import { ROUTES } from "@/routes.ts";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email address.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters long.",
  }),
});

export default function LoginPage() {
  const { setTokenState } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const token = await loginUser(values);
      setTokenState(token);
      navigate(ROUTES.HOME);
    } catch (error: unknown) {
      console.error(error);
      alert(typeof error === "string" ? error : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <div className="flex h-screen">
          {/* Left Section: Headings and Form */}
          <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-subtext p-8">
            {/* Headings */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-lg text-subtext mt-4">
                Enter Your Credentials to Continue
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" w-full max-w-md"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@nemetschek.bg" {...field} />
                    </FormControl>
                    {form.formState.errors.email && (
                      <div id="email-error" className="text-red-500 text-sm">
                        {form.formState.errors.email.message}
                      </div>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*****"
                        {...field}
                        autoComplete="current-password"
                      />
                    </FormControl>
                    {form.formState.errors.password && (
                      <div id="password-error" className="text-red-600 text-sm">
                        {form.formState.errors.password.message}
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !form.formState.isValid} // Disable button while loading
              >
                {loading ? "Logging in..." : "Start Exploring"}{" "}
                {/* Display loading text */}
              </Button>
              <div className="mt-2 text-center text-sm text-neutral-700">
                Don't have an account?{" "}
                <Link
                  to={ROUTES.REGISTER}
                  className="underline text-background-text"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>

          {/* Right Section: Image */}
          <div className="hidden mb:flex w-1/2 items-center justify-center bg-[#E3E3E3]"></div>
        </div>
      </Form>
    </>
  );
}

