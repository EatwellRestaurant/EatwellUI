"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-auth");
    if (!isLoggedIn) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600 text-sm">Yükleniyor...</p>
      </main>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#222] text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              📊 Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              🛒 Siparişler
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              🍔 Ürünler
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-yellow-400 transition-colors">
              👤 Kullanıcılar
            </a>
          </li>
        </ul>
      </aside>

      {/* Ana içerik */}
      <div className="flex-1 p-6 relative">
        {/* Sağ üst çıkış butonu */}
        <div className="absolute top-6 right-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Dashboard’a Hoş Geldin</h1>
        <p className="text-gray-700">
          Buradan tüm admin işlemlerini gerçekleştirebilirsin.
        </p>
      </div>
    </div>
  );
}
