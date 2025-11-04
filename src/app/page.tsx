"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Demo Escáner QR</h1>
      <button
        onClick={() => router.push("/scan")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg m-4"
      >
        Scanear QR
      </button>
      <button
        onClick={() => router.push("/scan2")}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg m-4"
      >
        Scanear QR 2
      </button>
    </div>
  );
}
