import "./globals.css";
import { Rajdhani, Raleway } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-rajdhani",
});
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-raleway",
});

export const metadata = {
  title: "Login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${raleway.variable}`}>
      <body className="font-raleway">{children}</body>
    </html>
  );
}
