'use client'
import { useEffect, useState } from "react";
import { Header } from "../shared/Header";
import NotificationPopup from "../notifications/NotificationPopup";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        const data = event.data;
        setNotification({
          title: data.title,
          message: data.body,
        });

        setTimeout(() => {
          setNotification(null);
        }, 5000); // Auto-close after 5 seconds
      });
    }
  }, []);

  return (
    <>
      <Header />
      {notification && <NotificationPopup title={notification?.title} message={notification?.message} onClose={() => setNotification(null)}/>}
      <main className="bg-bg px-2 relative min-h-[88vh] w-full flex flex-col items-center justify-center py-10">
        {children}
      </main>
    </>
  );
}
