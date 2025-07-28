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
import { SignupVal } from "@/lib/validation";
import { Link } from "react-router-dom";
import API from "@/lib/api";
import { authApis } from "@/lib/Apis/authApis";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ShieldIcon, UserIcon } from "lucide-react";

import { Eye, EyeOff } from "lucide-react";

enum Role {
  ROLE_USER = "ROLE_USER",
  ROLE_ADMIN = "ROLE_ADMIN",
}
const SignUp = () => {
  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<string>("");
  const [isShowSecretKeyInput, setIsShowSecretKeyInput] = React.useState(false);

  const buttonRef: any = useRef(null);

  const form = useForm<z.infer<typeof SignupVal>>({
    resolver: zodResolver(SignupVal),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      role: "ROLE_USER",
      key: "",
    },
  });

  const handleSignUp = async (user: z.infer<typeof SignupVal>) => {
    try {
      setIsDisabled(true);
      if (buttonRef.current) {
        buttonRef.current.innerHTML = `Signing Up...`;
      }

      const result = await authApis.signUp({
        firstName: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
        isActive: true,
        role: selectedRole === Role.ROLE_ADMIN ? Role.ROLE_ADMIN : Role.ROLE_USER,
        secretKey: user.key
      });

      if (result) {
        console.log("User signed up:", user);
        navigate("/sign-in");
      }
    } catch (error: any) {
      console.log(error);
      setValError(`Error: ${error || error.message}`);
    } finally {
      setIsDisabled(false);
      buttonRef.current.innerHTML = `Sign In`;
    }
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const [valError, setValError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Form {...form}>
      <div className="min-h-screen w-full flex bg-gray-50">
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background">
          <div className="md:hidden w-full max-w-md mb-8">
            <HeroSection onlyText className="text-center" />
          </div>
          <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-lg shadow-lg mt-2">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details to get started
              </p>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSignUp)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="text-md"
                          placeholder="John Doe"
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
                          placeholder="johndoe"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="text-md"
                          placeholder="name@example.com"
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
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value)=> {
                    setSelectedRole(value);
                    if(value === "ROLE_ADMIN"){
                      setIsShowSecretKeyInput(true);
                    }else{
                      setIsShowSecretKeyInput(false);
                    }
                  }}
                  required
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROLE_USER">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>User</span>
                          <span className="text-xs text-muted-foreground">
                            Standard access
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="ROLE_ADMIN">
                      <div className="flex items-center gap-2">
                        <ShieldIcon className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span>Administrator</span>
                          <span className="text-xs text-muted-foreground">
                            Full system access
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {
              isShowSecretKeyInput && 
              (<div className="space-y-2">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">Secret Key</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="text-md"
                          placeholder="Secret Key"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>)
              }

              {valError && (
                <Alert variant="default" className="text-[red]">
                  <AlertDescription className="text-[red]">{valError}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isDisabled}
                ref={buttonRef}
              >
                Sign Up
              </Button>

              <div className="text-center space-x-1">
                <span className="text-sm text-muted-foreground">
                  Already have an account?
                </span>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="text-sm font-medium hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
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

export default SignUp;
