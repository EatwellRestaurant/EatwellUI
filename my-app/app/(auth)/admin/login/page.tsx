"use client";

import { useState } from "react";
import { FloatingInput } from "@/components/ui/floating-input";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <main
      className="min-h-screen bg-[#f5f5f5] flex items-center justify-center"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 bg-[#d6af3a] rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-5xl  text-black mb-4">EATWELL</h1>
          <h2 className="text-4xl font-bold text-white b-2 my-4">
            ADMİN GİRİŞİ
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FloatingInput
            type="email"
            label="E-posta"
            icon="user"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FloatingInput
            type="password"
            label="Şifre"
            icon="lock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex flex-row space-x-4">
            <button
              type="submit"
              className="w-full bg-white text-[#333] rounded-full py-3 font-medium hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <a href="/admin/dashboard"> Giriş Yap</a>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
