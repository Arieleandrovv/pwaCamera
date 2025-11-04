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
  const [scanning, setScanning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Inicializa el lector
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    // Inicia la cámara automáticamente
    startCamera();

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  const startCamera = async () => {
    const html5QrCode = scannerRef.current;
    if (!html5QrCode) return;

    try {
      setError("");
      setScanning(true);
      await html5QrCode.start(
        { facingMode: { exact: "environment" } },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setResult(decodedText);
          html5QrCode.stop();
          setScanning(false);
        },
        (err) => console.warn(err)
      );
    } catch (err) {
      console.error(err);
      setError("No se pudo acceder a la cámara");
      setScanning(false);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !scannerRef.current) return;

    const html5QrCode = scannerRef.current;

    try {
      // Detenemos y limpiamos antes de escanear el archivo
      await html5QrCode.stop().catch(() => {});
      await html5QrCode.clear();

      const decodedText = await html5QrCode.scanFile(file, true);
      setResult(decodedText);
      console.log("QR detectado desde archivo:", decodedText);
    } catch (err) {
      console.error("Error al escanear archivo:", err);
      setError("No se pudo leer el QR desde la imagen.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black overflow-hidden w-full">
      {/* Título */}
      <div className="absolute top-6 z-10 text-center text-white">
        <h1 className="text-2xl font-bold">Escanea el código QR</h1>
        <p className="text-sm opacity-80">
          Usa la cámara o selecciona una imagen
        </p>
      </div>

      {/* Contenedor de cámara */}
      <div id="reader" className="absolute inset-0 w-full h-full z-0" />

      {/* Controles */}
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

        {!scanning ? (
          <Button
            onClick={startCamera}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Activar cámara
          </Button>
        ) : (
          <Button
            onClick={() => scannerRef.current?.stop()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Detener cámara
          </Button>
        )}

        <Button
          onClick={handleSelectImage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md mt-3"
        >
          Escanear desde imagen
        </Button>

        <Button
          onClick={() => router.push("/")}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md mt-3"
        >
          Regresar
        </Button>
      </div>
    </div>
  );
}
