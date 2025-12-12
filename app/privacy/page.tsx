import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft, Shield, Eye, Database, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Kebijakan Privasi</h1>
            <p className="mt-3 text-gray-500">Terakhir diperbarui: Desember 2024</p>
          </div>

          {/* Privacy Highlights */}
          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tanpa Pelacakan</h3>
                <p className="text-sm text-gray-500">Kami tidak melacak aktivitas Anda</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tanpa Cookies</h3>
                <p className="text-sm text-gray-500">Tidak ada cookies pihak ketiga</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Data Lokal</h3>
                <p className="text-sm text-gray-500">Semua proses di browser Anda</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gambar Aman</h3>
                <p className="text-sm text-gray-500">Tidak diupload ke server</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Pendahuluan</h2>
              <p className="text-gray-600 leading-relaxed">
                DesainCepat berkomitmen untuk melindungi privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami menangani informasi saat Anda menggunakan layanan kami.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Informasi yang Kami Kumpulkan</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>Singkatnya: Kami tidak mengumpulkan data pribadi Anda.</strong>
              </p>
              <p className="text-gray-600 leading-relaxed">
                DesainCepat adalah aplikasi yang berjalan sepenuhnya di browser Anda. Kami tidak mengumpulkan, menyimpan, atau memproses informasi pribadi apapun. Semua data desain Anda tetap di perangkat lokal Anda.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Penyimpanan Lokal</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Aplikasi kami menggunakan penyimpanan lokal browser (localStorage) untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Menyimpan preferensi desain Anda</li>
                <li>Menyimpan template yang Anda buat</li>
                <li>Menyimpan pengaturan aplikasi</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Data ini hanya tersimpan di browser Anda dan tidak pernah dikirim ke server kami.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Gambar dan Desain</h2>
              <p className="text-gray-600 leading-relaxed">
                Gambar yang Anda upload dan desain yang Anda buat diproses sepenuhnya di browser Anda. Kami tidak memiliki akses ke file atau desain Anda. Saat Anda menutup browser, data yang tidak disimpan akan hilang.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies dan Pelacakan</h2>
              <p className="text-gray-600 leading-relaxed">
                Kami tidak menggunakan cookies untuk pelacakan. Kami tidak menggunakan layanan analitik pihak ketiga seperti Google Analytics. Kami tidak melacak perilaku pengguna atau mengumpulkan data penggunaan.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Layanan Pihak Ketiga</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Aplikasi kami menggunakan layanan pihak ketiga berikut:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Google Fonts</strong> - untuk menyediakan pilihan font. Google mungkin mencatat permintaan font tetapi tidak terkait dengan identitas Anda.</li>
                <li><strong>Vercel</strong> - untuk hosting aplikasi. Vercel mungkin mencatat log akses standar (IP address, user agent) untuk keamanan.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Keamanan</h2>
              <p className="text-gray-600 leading-relaxed">
                Karena kami tidak mengumpulkan data Anda, tidak ada risiko kebocoran data dari sisi kami. Keamanan data lokal Anda bergantung pada keamanan perangkat dan browser yang Anda gunakan.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Hak Anda</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Anda memiliki kontrol penuh atas data Anda:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Hapus data lokal kapan saja melalui pengaturan browser</li>
                <li>Gunakan mode incognito untuk tidak menyimpan apapun</li>
                <li>Ekspor desain Anda kapan saja</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Perubahan Kebijakan</h2>
              <p className="text-gray-600 leading-relaxed">
                Jika kami mengubah kebijakan privasi ini, kami akan memperbarui tanggal &quot;Terakhir diperbarui&quot; di atas. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Kontak</h2>
              <p className="text-gray-600 leading-relaxed">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui GitHub repository DesainCepat.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm text-gray-500">© 2025 DesainCepat. MIT License.</p>
        </div>
      </footer>
    </div>
  );
}
