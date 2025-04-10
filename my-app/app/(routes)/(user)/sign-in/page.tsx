"use client";

import { useState } from "react";
import { FloatingInput } from "@/components/ui/floating-input";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Giriş başarısız");
      }

      const data = await res.json();
      console.log("Giriş başarılı:", data);

      // Örnek yönlendirme
      window.location.href = "/admin/dashboard";
    } catch (error: any) {
      alert(error.message || "Bir hata oluştu!");
    }
  };

  return (
    <main
      className="min-h-screen bg-[#f5f5f5] flex items-center justify-center"
      style={{
        backgroundImage: "url('images/bg-01.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 bg-[#d6af3a] rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-5xl  text-black mb-4">EATWELL</h1>
          <h2 className="text-4xl font-bold text-white b-2 my-4">
            HOŞ GELDİN!
          </h2>
          <p className="text-white/90">Hadi giriş yapalım...</p>
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/50 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium text-white cursor-pointer"
            >
              Beni Hatırla
            </label>
          </div>
          <div className="flex flex-row space-x-4">
            <button
              type="submit"
              className="w-full bg-white text-[#333] rounded-full py-3 font-medium hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Giriş Yap
            </button>
            <button
              type="submit"
              className="w-full bg-white text-[#333] rounded-full py-3 font-medium hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <a href="/sign-up">Kayıt ol</a>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
