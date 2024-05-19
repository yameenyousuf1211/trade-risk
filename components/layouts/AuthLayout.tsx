import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>
        <header className="border-b border-neutral-200 py-4 px-2  bg-white">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2"
          >
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
          </Link>
        </header>
        <main className="bg-bg px-2 relative w-full min-h-[92vh] flex flex-col items-center justify-center py-10">
          {children}
          <Image
            src="/images/auth-bg.png"
            alt="bg"
            width={500}
            height={500}
            className="object-cover absolute bottom-0 right-0"
          />
        </main>
      </div>
    </div>
  );
}
