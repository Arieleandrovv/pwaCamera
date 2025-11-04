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
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <div id="reader" className="absolute inset-0 z-0" />

      <div className="absolute border-4 border-white rounded-lg w-64 h-64 z-10" />

      <div className="absolute z-20 text-center text-white p-4">
        <h2 className="text-2xl font-semibold mb-1">Escanea el código QR</h2>
        <p className="text-sm opacity-80 mb-4">para ver los ítems del pedido</p>

        {result && (
          <p className="text-green-400 mt-2">QR detectado: {result}</p>
        )}
        {error && <p className="text-red-400 mt-2">{error}</p>}

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          onClick={handleSelectImage}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg"
        >
          Abrir galería
        </Button>
      </div>
    </div>
  );
}
