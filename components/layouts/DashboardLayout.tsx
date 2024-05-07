import { Poppins } from "next/font/google";
import { Header } from "../shared/Header";
const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="bg-bg px-2 relative w-full min-h-[88vh] flex flex-col items-center justify-center py-10">
        {children}
      </main>
    </>
  );
}
