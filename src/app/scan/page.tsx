"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ScanPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

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
    <div className="relativ flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">Escanea el codigo QR</h1>
      <h1 className="text-2xl font-bold mb-2">
        para poder ver los items del pedido
      </h1>

      <div
        id="reader"
        className="relative w-full h-full border-4 rounded-lg overflow-hidden"
      />

      {result && <p className="mt-4 text-green-600">QR detectado: {result}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        onClick={handleSelectImage}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg absolute"
      >
        Abrir galería
      </Button>
    </div>
  );
}
