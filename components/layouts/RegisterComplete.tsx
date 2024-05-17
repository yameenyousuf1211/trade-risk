import Image from "next/image";

export default function RegisterCompleteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-bg px-2 relative w-full min-h-screen flex flex-col items-center justify-center">
      {children}
      <Image
        src="/images/auth-bg.png"
        alt="bg"
        width={500}
        height={500}
        className="object-cover absolute bottom-0 right-0"
      />
    </main>
  );
}
