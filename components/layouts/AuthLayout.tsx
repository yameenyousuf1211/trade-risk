import { Poppins } from "next/font/google";
import Image from "next/image";
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
    <html lang="en">
      <body className={`${poppins.className}`}>
        <header className="border-b border-neutral-200 py-4 px-2 flex items-center justify-center gap-2 bg-white">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={50}
            height={50}
            className="object-cover size-10"
          />
          <h1 className="font-normal text-2xl">
            <span className="font-semibold">Trade</span>Risk
          </h1>
        </header>
        <main className="bg-bg px-2 relative w-full min-h-[88vh] flex flex-col items-center justify-center py-10">
          {children}
          <Image
            src="/images/auth-bg.png"
            alt="bg"
            width={500}
            height={500}
            className="object-cover absolute bottom-0 right-0"
          />
        </main>
      </body>
    </html>
  );
}
