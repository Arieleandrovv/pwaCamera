"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-2">Escanear QR</h1>

      <div
        id="reader"
        className="relative w-[300px] h-[300px] border-4 border-blue-500 rounded-lg overflow-hidden"
      />

      {result && <p className="mt-4 text-green-600">QR detectado: {result}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        onClick={handleSelectImage}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Abrir galería
      </button>
    </div>
  );
}
