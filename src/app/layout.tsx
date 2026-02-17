import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supp TS Starter",
  description:
    "Example project using the supp-ts SDK — AI-powered customer support classification and routing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Supp Widget — uses your publishable key */}
        {process.env.NEXT_PUBLIC_SUPP_PUBLISHABLE_KEY && (
          <Script
            src="https://supp.support/widget.js"
            data-api-key={process.env.NEXT_PUBLIC_SUPP_PUBLISHABLE_KEY}
            data-position="bottom-right"
            data-theme="light"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
