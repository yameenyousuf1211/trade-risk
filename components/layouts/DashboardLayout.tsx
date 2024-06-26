import { Header } from "../shared/Header";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <>
      <Header />
      <main className="bg-bg px-2 relative w-full min-h-[88vh] w-full flex flex-col items-center justify-center py-10">
        {children}
      </main>
    </>
  );
}
