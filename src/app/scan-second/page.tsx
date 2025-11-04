"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const router = useRouter();

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            setResult(decodedText);
            html5QrCode.stop();
          },
          (err) => console.warn(err)
        );
      } catch (err) {
        console.error(err);
        setError("No se pudo acceder a la cámara");
      }
    };

    startScanner();

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  const handleSelectImage = () => fileInputRef.current?.click();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await scannerRef.current!.scanFile(file, true);
      setResult(text);
    } catch (err) {
      console.error(err);
      setError("No se pudo leer el QR desde la imagen.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-hidden w-full">
      <div id="reader" className="inset-0 w-full h-screen z-0" />
      {/*<div className="absolute w-64 h-64 border-4 border-white rounded-lg z-10" />*/}
    </div>
  );
}
