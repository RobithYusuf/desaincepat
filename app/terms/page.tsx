import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Syarat & Ketentuan</h1>
            <p className="mt-3 text-gray-500">Terakhir diperbarui: Desember 2024</p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Penerimaan Ketentuan</h2>
              <p className="text-gray-600 leading-relaxed">
                Dengan mengakses dan menggunakan DesainCepat, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Deskripsi Layanan</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                DesainCepat adalah aplikasi web gratis untuk membuat thumbnail dan desain grafis. Layanan kami meliputi:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Editor thumbnail dengan berbagai ukuran preset</li>
                <li>Generator gradien mesh</li>
                <li>Mode bulk untuk pembuatan massal</li>
                <li>Ekspor gambar berkualitas tinggi</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Penggunaan yang Diizinkan</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Anda diizinkan untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Menggunakan layanan untuk keperluan pribadi dan komersial</li>
                <li>Membuat dan mengunduh desain tanpa batas</li>
                <li>Menggunakan hasil desain untuk platform manapun</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Batasan Penggunaan</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Anda tidak diizinkan untuk:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Menggunakan layanan untuk konten ilegal atau melanggar hukum</li>
                <li>Mencoba merusak, menonaktifkan, atau mengganggu layanan</li>
                <li>Menggunakan bot atau script otomatis tanpa izin</li>
                <li>Menyalin atau mendistribusikan kode sumber tanpa atribusi</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Hak Kekayaan Intelektual</h2>
              <p className="text-gray-600 leading-relaxed">
                DesainCepat adalah proyek open-source di bawah lisensi MIT. Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode dengan tetap menyertakan atribusi. Desain yang Anda buat adalah milik Anda sepenuhnya.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Penafian</h2>
              <p className="text-gray-600 leading-relaxed">
                Layanan disediakan &quot;sebagaimana adanya&quot; tanpa jaminan apapun. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan ini.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Perubahan Ketentuan</h2>
              <p className="text-gray-600 leading-relaxed">
                Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Kontak</h2>
              <p className="text-gray-600 leading-relaxed">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami melalui GitHub repository DesainCepat.
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
