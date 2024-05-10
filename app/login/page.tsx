"use client";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/validation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { onLogin } from "@/services/apis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const { mutateAsync, status } = useMutation({
    mutationFn: onLogin,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    const { response, success } = await mutateAsync(data);
    // console.log(response);
    if (success == false) return toast.error(response as string);
    if (success == true) {
      setUser(response.data.user);
      toast.success("Login successfull");
      router.push(response.data.user.role === "corporate" ? "/" : "/dashboard");
    }
  };

  return (
    <AuthLayout>
      <section className="max-w-md mx-auto w-full max-xs:px-4 z-10">
        <h2 className="font-bold text-5xl text-center">Sign In</h2>
        <p className="text-para text-center mt-5">
          Sign in using your registered credentials to start trading
        </p>
        <form
          className="bg-white rounded-xl p-8 z-10 mt-5 flex flex-col gap-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FloatingInput
            placeholder="Company Email"
            type="email"
            name="email"
            register={register}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <div className="relative w-full">
            <input
              type={showPass ? "text" : "password"}
              id="password"
              className="block px-2.5 pb-2.5 pt-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-borderCol appearance-none focus:outline-none focus:ring-0 focus:border-text peer"
              placeholder=""
              {...register("password")}
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-text peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Password
            </label>
            <button
              type="button"
              className="absolute right-3 top-3"
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showPass ? (
                <Eye className="size-5 text-gray-500" />
              ) : (
                <EyeOff className="size-5 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" />
              <label
                htmlFor="remember"
                className="text-sm text-para leading-none"
              >
                Remember Me
              </label>
            </div>
            <Link href="/login/forgot-password" className="text-text text-sm">
              Forgot Password
            </Link>
          </div>

          <Button
            role="submit"
            className="bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
            size="lg"
            disabled={isSubmitting}
          >
            Login
          </Button>
        </form>

        <p className="text-para mt-10 text-sm text-center">
          Don&apos;t have a TradeRisk account?{" "}
          <Link href="/register" className="text-text font-semibold">
            Register now
          </Link>
        </p>
      </section>
    </AuthLayout>
  );
}
