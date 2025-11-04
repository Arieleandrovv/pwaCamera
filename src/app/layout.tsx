import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Scanner",
  description: "Escanea códigos QR fácilmente desde tu celular",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d6efd" />
      </head>
      <body>{children}</body>
    </html>
  );
}
