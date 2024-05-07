import { Poppins } from "next/font/google";
import Image from "next/image";
import { RegisterStepnav } from "../helpers/RegisterStepnav";
const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default function CorporateStepLayout({
  children,
  step,
  title,
  text,
}: Readonly<{
  children: React.ReactNode;
  step: number;
  title: string;
  text: string;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className}`}>
        <RegisterStepnav step={step}/>
        <main className="bg-bg px-2 relative w-full min-h-[88vh] flex flex-col items-center justify-center py-10">
          <div className="max-w-xl mb-5">
            <h2 className="font-semibold text-3xl text-center">{title}</h2>
            <p className="text-para text-center mt-5">{text}</p>
          </div>
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
