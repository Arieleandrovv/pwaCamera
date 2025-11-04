"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            console.log("QR detectado:", decodedText);
            html5QrCode.stop();
          },
          (err) => console.warn(err)
        );
      } catch (err) {
        console.error("No se pudo acceder a la cámara:", err);
      }
    };

    startScanner();

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      <div id="reader" className="w-full h-full" />
    </div>
  );
}
