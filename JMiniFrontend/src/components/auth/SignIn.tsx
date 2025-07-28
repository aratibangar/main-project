import React, { useEffect, useRef } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import HeroSection from "./HeroSection";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SigninVal } from "@/lib/validation";
import { Link } from "react-router-dom";
import API from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";


const SignIn = () => {
  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = React.useState(false);
  const buttonRef = useRef(null);

  const form = useForm<z.infer<typeof SigninVal>>({
    resolver: zodResolver(SigninVal),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSignIn = async (user: z.infer<typeof SigninVal>) => {
    setIsDisabled(true);
    if (buttonRef.current) {
      (buttonRef.current as HTMLButtonElement).disabled = true;
    }
    try {
      const response = await API.post("/auth/login", user);
      if (response) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      }
    } catch (error: any) {
      setValError(error.message || "An error occurred during sign in.");
      console.error("Sign in error:", error);
    } finally {
      setIsDisabled(false);
      if (buttonRef.current) {
        (buttonRef.current as HTMLButtonElement).disabled = false;
      }
    }
  };

  const handleSignUp = () => {
    navigate("/sign-up");
  };

  const [valError, setValError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Form {...form}>
      <div className="min-h-screen w-full flex bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background md:bg-background">
          <div className="md:hidden w-full max-w-md mb-8">
            <HeroSection onlyText className="text-center" />
          </div>
          <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-lg shadow-lg mt-2">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSignIn)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="text-md"
                          placeholder="name@example"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="text-md pr-10"
                            placeholder="••••••••"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {valError && (
                <Alert variant="destructive">
                  <AlertDescription>{valError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isDisabled}
                ref={buttonRef}
              >
                Sign In
              </Button>

              <div className="text-center space-x-1">
                <span className="text-sm text-muted-foreground">
                  Don't have an account?
                </span>
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="text-sm font-medium hover:underline"
                >
                  Sign up
                </button>
              </div>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link
                to="/terms-and-conditions"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex-1 h-screen hidden md:block">
          <HeroSection />
        </div>
      </div>
    </Form>
  );
};

export default SignIn;
