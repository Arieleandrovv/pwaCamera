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
    <div className="relative flex flex-col items-center justify-center h-screen bg-black overflow-hidden w-full">
      <div className="absolute top-6 z-10 text-center text-white">
        <h1 className="text-2xl font-bold">Escanea el código QR</h1>
        <p className="text-sm opacity-80">
          para poder ver los ítems del pedido
        </p>
      </div>
      <div className="absolute bottom-10 flex flex-col items-center z-10 w-full px-4">
        {result && (
          <p className="text-green-400 text-sm mb-2 text-center">
            QR detectado: {result}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm mb-2 text-center">{error}</p>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={handleSelectImage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Abrir galería
        </Button>
        <Button
          onClick={() => router.push("/")}
          className="bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded-lg shadow-md mt-4"
        >
          regresar
        </Button>
      </div>
      <div id="reader" className="inset-0 w-full h-full z-0" />
      <div className="absolute w-64 h-64 border-4 border-white rounded-lg z-10" />
    </div>
  );
}
