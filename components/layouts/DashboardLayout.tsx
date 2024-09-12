"use client";
import { useEffect, useState } from "react";
import { Header } from "../shared/Header";
import NotificationPopup from "../notifications/NotificationPopup";
import { messaging } from "@/services/firebase/firebaseConfig";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        const data = event.data;
        console.log(data?.notification, "data?.no");
        setNotification({
          title: data?.notification?.title,
          message: data?.notification?.body,
          lcId: data?.notification?.data?.lc,
        });

        setTimeout(() => {
          setNotification(null);
        }, 5000); // Auto-close after 5 seconds
      });
    }
  }, []);

  return (
    <div className="overscroll-none">
      <Header />
      {notification && (
        <NotificationPopup
          lcId={notification?.lcId}
          title={notification?.title}
          message={notification?.message}
          onClose={() => setNotification(null)}
        />
      )}
      <main className="relative flex min-h-[88vh] w-full flex-col items-center justify-center overscroll-none bg-bg px-2 py-10">
        {children}
      </main>
    </div>
  );
}
