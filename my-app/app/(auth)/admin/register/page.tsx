"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingInput } from "@/components/ui/floating-input";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(
        "http://eatwellrestaurantapi.somee.com/api/Auths/Register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
          }),
        }
      );

      if (!res.ok) {
        const contentType = res.headers.get("Content-Type");

        if (contentType?.includes("application/json")) {
          const errJson = await res.json();
          setErrorMessage(errJson.message || "Kayıt başarısız.");
        } else {
          const errText = await res.text();
          console.error("API Text Hatası:", errText);
          setErrorMessage("Kayıt başarısız. Sunucu cevabı okunamadı.");
        }
        return;
      }

      const data = await res.json();
      console.log("Kayıt başarılı:", data);

      setSuccessMessage(
        "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz..."
      );
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (error) {
      console.error("Sunucu hatası:", error);
      setErrorMessage("Sunucuya ulaşılamadı.");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#f5f5f5",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md p-8 bg-[#d6af3a] rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-5xl text-black mb-4">EATWELL</h1>
          <h2 className="text-3xl font-bold text-white">ADMİN KAYIT</h2>
          <p className="text-white/90 text-sm mt-1">
            Lütfen bilgilerinizi girin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FloatingInput
            type="text"
            label="Ad"
            icon="user"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <FloatingInput
            type="text"
            label="Soyad"
            icon="user"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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

          <button
            type="submit"
            className="w-full bg-white text-[#333] rounded-full py-3 font-medium hover:bg-black hover:text-white transition-colors cursor-pointer"
          >
            Kayıt Ol
          </button>
          <div className="text-center">
            <a
              href="/admin/login"
              className="text-sm text-white hover:underline hover:text-black underline-none "
            >
              Zaten Bir Hesabın Var mı? Giriş Yap
            </a>
          </div>
          {errorMessage && (
            <p className="text-center text-red-600 text-sm">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-center text-green-600 text-sm">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
