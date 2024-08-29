// components/LoginPageComponent.js
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
import { useEffect, useState } from "react";
import { CircleCheckIcon, CircleX, Eye, EyeOff } from "lucide-react";
import { registerGCMToken } from "@/services/apis/notifications.api";
import { messaging } from "../../services/firebase/firebaseConfig";
import {
  arrayBufferToBase64,
  urlBase64ToUint8Array,
} from "@/utils/helper/service-worker";
import { yupResolver } from "@hookform/resolvers/yup";
import { getToken } from "@firebase/messaging";

export default function LoginPageComponent() {
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

  const [fcmToken, setFcmToken] = useState<string>("");

  // REGISTERING NOTIFICATIONS SERVICE
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      navigator &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  // NOTIFICATIONS PERMISSION
  async function requestPermission() {
    //requesting permission using Notification API
    if (typeof window !== "undefined") {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BIJbtJkCgGGt4R1zHAQUiTSig_iSelqiWZe7zve-mUJajAiMoul0qaLnROe5T6l0r0EKwJJFs9sDKYHB-xmqFE0",
        });

        //We can send token to server
        console.log("Token generated : ", token);
        setFcmToken(token);
      } else if (permission === "denied") {
        //notifications are blocked
        alert("You denied for the notification");
      }
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  const onSubmit: SubmitHandler<typeof loginSchema> = async (data) => {
    const { response, success } = await mutateAsync({
      ...data,
      fcmToken: fcmToken.length > 0 ? fcmToken : "lklkklklk",
    });

    if (success) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        console.log(permission, "PERMISSIONS");
      }

      setUser(response.data.user);
      const toastId = toast.success(
        <div className="flex w-full items-center justify-between">
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
      <section className="max-xs:px-4 z-10 mx-auto w-full max-w-md">
        <h2 className="text-center text-5xl font-bold">Sign In</h2>
        <p className="mt-5 text-center font-roboto font-normal text-para">
          Sign in using your registered credentials to start trading
        </p>
        <form
          className="z-10 mt-8 flex flex-col gap-y-7 rounded-3xl bg-white p-8"
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
              <span className="absolute mt-1 text-[12px] text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="relative mb-1 w-full">
            <input
              type={showPass ? "text" : "password"}
              id="password"
              className="peer block w-full appearance-none rounded-lg border border-borderCol bg-transparent px-2.5 pb-2.5 pt-2.5 text-sm text-lightGray focus:border-text focus:outline-none focus:ring-0"
              placeholder=""
              {...register("password")}
            />
            <label
              htmlFor="password"
              className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-400 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
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
              <span className="absolute mt-1 text-[12px] text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" />
              <label
                htmlFor="remember"
                className="font-roboto text-sm leading-none text-para"
              >
                Remember Me
              </label>
            </div>
            <Link
              href="/login/forgot-password"
              className="font-roboto text-sm text-text"
            >
              Forgot Password
            </Link>
          </div>

          <Button
            role="submit"
            className="rounded-lg bg-primaryCol py-6 text-[16px] hover:bg-primaryCol/90"
            size="lg"
            disabled={isSubmitting}
          >
            Login
          </Button>
        </form>

        <p className="mt-10 text-center font-roboto text-sm text-para">
          Don&apos;t have a TradeRisk account?{" "}
          <Link href="/register" className="font-medium text-text">
            Register now
          </Link>
        </p>
      </section>
    </AuthLayout>
  );
}
