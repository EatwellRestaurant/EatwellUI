"use client";

import { useState } from "react";
import { FloatingInput } from "@/components/ui/floating-input";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    // Register işlemi API üzerinden yapılabilir
    console.log({ name, email, password });

    // Örnek yönlendirme:
    router.push("/login");
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
          <h1 className="text-5xl text-black mb-4">EATWELL</h1>
          <h2 className="text-4xl font-bold text-white mb-2">KAYIT OL</h2>
          <p className="text-white/90">Yeni bir hesap oluştur.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FloatingInput
            type="text"
            label="Ad Soyad"
            icon="user"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FloatingInput
            type="email"
            label="E-posta"
            icon="mail"
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

          <FloatingInput
            type="password"
            label="Şifre Tekrar"
            icon="lock"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex flex-row space-x-4">
            <button
              type="submit"
              className="w-full bg-white text-[#333] rounded-full py-3 font-medium hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Kayıt Ol
            </button>
          </div>
          <div className="text-center">
            <a
              href="/login"
              className="text-sm text-white hover:underline hover:text-black underline-none "
            >
              Zaten Bir Hesabın Var mı? Giriş Yap
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
