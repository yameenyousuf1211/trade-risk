"use client";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/validation";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/helpers/FloatingInput";
import Link from "next/link";
import AuthLayout from "@/components/layouts/AuthLayout";
import { onLogin } from "@/services/apis";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { CircleCheckIcon, CircleX, Eye, EyeOff } from "lucide-react";
import { registerGCMToken } from "@/services/apis/notifications.api";
import {
  arrayBufferToBase64,
  urlBase64ToUint8Array,
} from "@/utils/helper/service-worker";
import { yupResolver } from "@hookform/resolvers/yup";
export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPass, setShowPass] = useState(false);

  const { mutateAsync } = useMutation({
    mutationFn: onLogin,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const [notificationPermission, setNotificationPermission] = useState(
    typeof window !== "undefined" ? Notification.permission : ""
  );

  const registerServiceWorker = async () => {
    const register =
      await navigator.serviceWorker.register("/service-worker.js");
    const registrationReady = await navigator.serviceWorker.ready;
    // console.log(registrationReady)
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BKOPYlgOw1eAWgeVCt8uZWCTAaBUd4ReGVd9Qfs2EtK_DvRXuI_LFQSiyxjMN8rg47BWP9_8drlyE0O1GXMP4ew"
      ),
    });
    // console.log(subscription);
    const authToken = arrayBufferToBase64(
      subscription.getKey("auth") as ArrayBuffer
    );
    const hashKey = arrayBufferToBase64(
      subscription.getKey("p256dh") as ArrayBuffer
    );
    // console.log(subscription)
    // console.log(authToken);
    // console.log(hashKey)
    if (subscription) {
      const gcmToken = await registerGCMToken({
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        authToken,
        hashKey,
      });
      console.log(gcmToken, "gcmtoken");
    }
  };

  const onSubmit: SubmitHandler<typeof loginSchema> = async (data) => {
    const { response, success } = await mutateAsync(data);
    console.log(response, "pipipi");

    if (success) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        if ("serviceWorker" in navigator) {
          await registerServiceWorker();
        }
      }
      setUser(response.data.user);
      const toastId = toast.success(
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <CircleCheckIcon className="mr-2 size-5" />
            <h1 className="text-[1rem]">You have logged in successfully!</h1>
          </div>
          <CircleX
            className="ml-2 size-5 hover:cursor-pointer"
            onClick={() => toast.dismiss(toastId)}
          />
        </div>
      );
      router.push(response.data.user.type === "corporate" ? "/" : "/dashboard");
    } else return toast.error(response as string);
  };

  return (
    <AuthLayout>
      <section className="max-w-md mx-auto w-full max-xs:px-4 z-10">
        <h2 className="font-bold text-5xl text-center">Sign In</h2>
        <p className="text-para font-roboto font-normal text-center mt-5">
          Sign in using your registered credentials to start trading
        </p>
        <form
          className="bg-white rounded-3xl p-8 z-10 mt-8 flex flex-col gap-y-7"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="relative">
            <FloatingInput
              placeholder="Company Email"
              type="email"
              name="email"
              register={register}
            />
            {errors.email && (
              <span className="mt-1 absolute text-red-500 text-[12px]">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="relative w-full mb-1">
            <input
              type={showPass ? "text" : "password"}
              id="password"
              className="block px-2.5 pb-2.5 pt-2.5 w-full text-sm text-lightGray bg-transparent rounded-lg border border-borderCol appearance-none focus:outline-none focus:ring-0 focus:border-text peer"
              placeholder=""
              {...register("password")}
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-400  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-text peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
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
            {errors.password && (
              <span className="mt-1 absolute text-red-500 text-[12px]">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-roboto text-para leading-none"
              >
                Remember Me
              </label>
            </div>
            <Link
              href="/login/forgot-password"
              className="text-text font-roboto text-sm"
            >
              Forgot Password
            </Link>
          </div>

          <Button
            role="submit"
            className="py-6 bg-primaryCol hover:bg-primaryCol/90 text-[16px] rounded-lg"
            size="lg"
            disabled={isSubmitting}
          >
            Login
          </Button>
        </form>

        <p className="text-para font-roboto mt-10 text-sm text-center">
          Don&apos;t have a TradeRisk account?{" "}
          <Link href="/register" className="text-text font-medium">
            Register now
          </Link>
        </p>
      </section>
    </AuthLayout>
  );
}
