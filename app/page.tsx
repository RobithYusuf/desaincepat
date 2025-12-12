"use client";

import Link from "next/link";
import NextImage from "next/image";
import { Navbar } from "@/components/Navbar";
import { 
  Sparkles, 
  Zap, 
  Palette, 
  Download, 
  ArrowRight, 
  Image as ImageIcon, 
  Type, 
  Layers,
  CheckCircle2,
  MonitorPlay,
  Instagram,
  Twitter,
  LayoutTemplate,
  Wand2,
  ShieldCheck,
  Cpu
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import 3D component (client-side only)
const Hero3DBackground = dynamic(() => import("@/components/Hero3DModern"), {
  ssr: false,
  loading: () => null,
});

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* =========================================
           HERO SECTION
           ========================================= */}
        <section className="relative overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
          <Hero3DBackground />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-green-100 bg-green-50/80 px-4 py-1.5 text-sm font-medium text-green-700 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Generator Thumbnail #1 di Indonesia</span>
              </div>
              
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                Fokus Bikin Konten,
                <br />
                <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                  Biar Kami Urus Desain
                </span>
              </h1>
              
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl md:leading-relaxed">
                Buat thumbnail YouTube profesional, konten media sosial, dan gradien secara instan. 
                <span className="font-semibold text-gray-900"> Tanpa daftar. Tanpa watermark. Langsung pakai.</span>
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                <Link
                  href="/thumbnail"
                  className="group relative inline-flex items-center gap-3 rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-green-200 transition-all hover:bg-green-700 hover:shadow-2xl hover:shadow-green-300 hover:-translate-y-1"
                >
                  <Wand2 className="h-5 w-5" />
                  Mulai Buat Sekarang
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/gradient-editor"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  <Palette className="h-5 w-5" />
                  Coba Gradient Editor
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500 sm:gap-x-12">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Tanpa Perlu Akun</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Mudah Digunakan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Ekspor Kualitas Tinggi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
           PROBLEM / SOLUTION STRIP
           ========================================= */}
        <section className="border-y border-gray-100 bg-gray-50/50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Super Cepat</h3>
                <p className="text-gray-600">Lupakan software rumit. Buat, edit, dan ekspor dalam 60 detik.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Buat Banyak Sekaligus</h3>
                <p className="text-gray-600">Butuh 10 thumbnail? Generate semuanya sekaligus dengan Mode Bulk.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">Privasi Terjamin</h3>
                <p className="text-gray-600">Semua proses di browser kamu. Gambar tidak pernah dikirim ke server.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
           FEATURE SHOWCASE (ZIG-ZAG)
           ========================================= */}
        <section className="py-24 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Feature 1: The Editor */}
            <div className="mb-24 flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
              <div className="flex-1 lg:order-1">
                <div className="relative rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 p-4 shadow-2xl ring-1 ring-gray-900/5">
                   <div className="aspect-[16/9] overflow-hidden rounded-xl bg-white shadow-inner">
                      {/* Abstract Representation of Editor */}
                      <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-90 transition-transform hover:scale-105 duration-700"></div>
                   </div>
                   {/* Decorative elements */}
                   <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-green-400 blur-3xl opacity-20"></div>
                   <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-blue-400 blur-3xl opacity-20"></div>
                </div>
              </div>
              <div className="flex-1 lg:order-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                  Fitur Utama
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Editor Profesional
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                  Jangan puas dengan tool biasa. Akses 26+ font Google premium, atur tinggi baris, spasi, dan warna dengan presisi. Tambah tekstur noise untuk estetika modern.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-green-600 text-white">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-gray-700">Kontrol Tipografi Lengkap</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-green-600 text-white">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-gray-700">Interface Drag & Drop</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-green-600 text-white">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-gray-700">Preview Real-time</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Gradients */}
            <div className="mb-24 flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
              <div className="flex-1 lg:order-2">
                <div className="relative rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-gray-900/5">
                   <div className="aspect-[16/9] overflow-hidden rounded-xl bg-slate-900 relative shadow-inner group">
                      {/* Fake Mesh Gradient Representation */}
                      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-purple-500 rounded-full blur-[80px] opacity-70 animate-blob mix-blend-screen"></div>
                      <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-500 rounded-full blur-[80px] opacity-70 animate-blob animation-delay-2000 mix-blend-screen"></div>
                      <div className="absolute top-[20%] right-[10%] w-[60%] h-[60%] bg-pink-500 rounded-full blur-[80px] opacity-70 animate-blob animation-delay-4000 mix-blend-screen"></div>
                      <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] bg-emerald-400 rounded-full blur-[80px] opacity-60 animate-blob animation-delay-6000 mix-blend-screen"></div>
                      
                      {/* Subtle Noise Texture Overlay */}
                      <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-20 mix-blend-overlay"></div>
                      
                      {/* UI Controls Overlay (Fake) */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex gap-2">
                          <div className="h-2 w-2 rounded-full bg-white/50"></div>
                          <div className="h-2 w-2 rounded-full bg-white/50"></div>
                          <div className="h-2 w-2 rounded-full bg-white/50"></div>
                        </div>
                        <div className="h-1.5 w-20 rounded-full bg-white/20"></div>
                      </div>
                   </div>
                   {/* Decorative elements */}
                   <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-purple-400/30 blur-3xl -z-10"></div>
                   <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-blue-400/30 blur-3xl -z-10"></div>
                </div>
              </div>
              <div className="flex-1 lg:order-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700">
                  Visual
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Gradien Tanpa Batas
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                  Berhenti pakai warna solid yang membosankan. Generator Mesh Gradient kami menciptakan background organik dan dinamis. Campur warna, tambah blur, dan putar bentuk untuk identitas brand unik.
                </p>
                <div className="mt-8 flex gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">180+</span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Preset Siap Pakai</span>
                  </div>
                  <div className="h-auto w-px bg-gray-200"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">∞</span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Kombinasi Custom</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Bulk Mode */}
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
              <div className="flex-1 lg:order-1">
                <div className="relative rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 p-4 shadow-2xl ring-1 ring-gray-900/5">
                   <div className="aspect-[16/9] overflow-hidden rounded-xl bg-white shadow-inner flex flex-col border border-gray-100">
                      {/* Bulk UI Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
                          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
                          <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-medium text-gray-400">Memproses 12 item...</span>
                           <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full w-2/3 bg-green-500"></div>
                           </div>
                        </div>
                      </div>
                      
                      {/* Bulk Grid Content */}
                      <div className="grid flex-1 grid-cols-2 gap-3 p-4 sm:grid-cols-3">
                         {/* Item 1 */}
                         <div className="group relative overflow-hidden rounded-lg bg-slate-900 shadow-sm transition-transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-blue-500/80"></div>
                            <div className="relative flex h-full flex-col justify-end p-2.5">
                               <div className="h-1.5 w-3/4 rounded-full bg-white/40 mb-1.5"></div>
                               <div className="h-1.5 w-1/2 rounded-full bg-white/20"></div>
                            </div>
                         </div>
                         {/* Item 2 */}
                         <div className="group relative overflow-hidden rounded-lg bg-slate-900 shadow-sm transition-transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/80 to-teal-500/80"></div>
                            <div className="relative flex h-full flex-col justify-end p-2.5">
                               <div className="h-1.5 w-2/3 rounded-full bg-white/40 mb-1.5"></div>
                               <div className="h-1.5 w-1/3 rounded-full bg-white/20"></div>
                            </div>
                         </div>
                         {/* Item 3 */}
                         <div className="group relative overflow-hidden rounded-lg bg-slate-900 shadow-sm transition-transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 to-red-500/80"></div>
                            <div className="relative flex h-full flex-col justify-end p-2.5">
                               <div className="h-1.5 w-3/4 rounded-full bg-white/40 mb-1.5"></div>
                               <div className="h-1.5 w-1/2 rounded-full bg-white/20"></div>
                            </div>
                         </div>
                         {/* Item 4 */}
                         <div className="group relative overflow-hidden rounded-lg bg-slate-900 shadow-sm transition-transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/80 to-rose-500/80"></div>
                            <div className="relative flex h-full flex-col justify-end p-2.5">
                               <div className="h-1.5 w-2/3 rounded-full bg-white/40 mb-1.5"></div>
                               <div className="h-1.5 w-1/3 rounded-full bg-white/20"></div>
                            </div>
                         </div>
                         {/* Item 5 */}
                         <div className="group relative overflow-hidden rounded-lg bg-slate-900 shadow-sm transition-transform hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/80 to-violet-500/80"></div>
                            <div className="relative flex h-full flex-col justify-end p-2.5">
                               <div className="h-1.5 w-3/4 rounded-full bg-white/40 mb-1.5"></div>
                               <div className="h-1.5 w-1/2 rounded-full bg-white/20"></div>
                            </div>
                         </div>
                         {/* ZIP Download Overlay */}
                         <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
                            <div className="flex flex-col items-center gap-1 text-gray-400">
                               <Download className="h-5 w-5" />
                               <span className="text-[9px] font-bold uppercase tracking-wider">Unduh ZIP</span>
                            </div>
                         </div>
                      </div>
                   </div>
                   {/* Decorative elements */}
                   <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-orange-400 blur-3xl opacity-20"></div>
                   <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-green-400 blur-3xl opacity-20"></div>
                </div>
              </div>
              <div className="flex-1 lg:order-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                  Produktivitas
                </div>
                <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Buat Massal dengan Mode Bulk
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                  Content creator? Agency? Generate puluhan variasi sekaligus. Cukup masukkan judul, pilih style, dan download file ZIP semua aset secara instan.
                </p>
                <Link 
                  href="/thumbnail" 
                  className="mt-8 inline-flex items-center text-green-600 font-semibold hover:text-green-700"
                >
                  Coba Mode Bulk <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
           HOW IT WORKS
           ========================================= */}
        <section className="bg-gray-900 py-24 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">Tiga Langkah Mudah</h2>
              <p className="mt-4 text-gray-400">Tidak perlu tutorial rumit. Desain intuitif dan mudah digunakan.</p>
            </div>
            
            <div className="grid gap-12 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-green-400 shadow-lg ring-1 ring-white/10">
                  <LayoutTemplate className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">1. Pilih Template atau Mulai Kosong</h3>
                <p className="mt-3 text-gray-400">
                  Pilih dari preset untuk YouTube, Instagram, atau Twitter, atau tentukan ukuran custom sendiri.
                </p>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-gray-700">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-blue-400 shadow-lg ring-1 ring-white/10">
                  <Palette className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">2. Kustomisasi Sesuai Selera</h3>
                <p className="mt-3 text-gray-400">
                  Atur warna, font, shadow, dan posisi. Tambah tekstur noise atau gradien overlay agar lebih menarik.
                </p>
                <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-gray-700">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800 text-purple-400 shadow-lg ring-1 ring-white/10">
                  <Download className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">3. Ekspor HD</h3>
                <p className="mt-3 text-gray-400">
                  Download sebagai PNG berkualitas tinggi (hingga 3x resolusi). Siap upload ke platform favoritmu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
           FEATURES GRID (COMPACT)
           ========================================= */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Fitur Lengkap</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Type, title: "26+ Font", desc: "Font Google pilihan terbaik" },
                { icon: ImageIcon, title: "Upload Gambar", desc: "Pakai aset sendiri" },
                { icon: Layers, title: "Template", desc: "Simpan & gunakan ulang" },
                { icon: Wand2, title: "Efek Noise", desc: "Tekstur modern & estetik" },
                { icon: MonitorPlay, title: "YouTube Ready", desc: "Optimasi 1280x720" },
                { icon: Instagram, title: "Instagram Portrait", desc: "Dukungan rasio 4:5" },
                { icon: Twitter, title: "Twitter Headers", desc: "Ukuran banner sempurna" },
                { icon: Download, title: "Kualitas 3x", desc: "Ekspor Ultra HD" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
           FAQ SECTION - Minimalist Wide Layout
           ========================================= */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">FAQ</h2>
              <p className="mt-3 text-gray-500">Pertanyaan umum tentang DesainCepat</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                    Apakah perlu membuat akun untuk menggunakan DesainCepat?
                  </h3>
                  <span className="ml-6 flex-shrink-0 text-gray-400">
                    <svg className="h-5 w-5 transition-transform duration-200 group-open:rotate-45" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
                  Tidak perlu! Kamu bisa langsung menggunakan DesainCepat tanpa registrasi. Cukup buka website dan mulai buat desain.
                </p>
              </details>

              <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                    Apakah gambar saya disimpan di server?
                  </h3>
                  <span className="ml-6 flex-shrink-0 text-gray-400">
                    <svg className="h-5 w-5 transition-transform duration-200 group-open:rotate-45" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
                  Tidak. Semua proses dilakukan lokal di browser kamu. Kami tidak mengupload gambar ke server manapun. Privasi kamu adalah prioritas kami.
                </p>
              </details>

              <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                    Bisa digunakan di HP?
                  </h3>
                  <span className="ml-6 flex-shrink-0 text-gray-400">
                    <svg className="h-5 w-5 transition-transform duration-200 group-open:rotate-45" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
                  Tentu saja. Interface-nya fully responsive dan touch-friendly. Kamu bisa buat desain di smartphone, tablet, atau komputer desktop.
                </p>
              </details>

              <details className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                    Format ekspor apa yang didukung?
                  </h3>
                  <span className="ml-6 flex-shrink-0 text-gray-400">
                    <svg className="h-5 w-5 transition-transform duration-200 group-open:rotate-45" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
                  Ekspor desain sebagai file PNG berkualitas tinggi dengan scaling hingga 3x resolusi. Cocok untuk YouTube, Instagram, Twitter, dan platform lainnya.
                </p>
              </details>


            </div>
          </div>
        </section>

        {/* =========================================
           FINAL CTA
           ========================================= */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Siap Tingkatkan Visual Kontenmu?
            </h2>
            <p className="mt-6 text-lg text-green-100 sm:text-xl">
              Bergabung dengan komunitas kreator yang membuat konten lebih baik dan lebih cepat.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/thumbnail"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-green-600 shadow-2xl transition-all hover:bg-gray-50 hover:scale-105"
              >
                Buka Editor
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================
           FOOTER
           ========================================= */}
      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <NextImage src="/icon.png" alt="DesainCepat" width={32} height={32} className="rounded-lg" />
                <span className="text-xl font-bold text-gray-900">DesainCepat</span>
              </div>
              <p className="mt-4 text-sm text-gray-600 max-w-xs leading-relaxed">
                Cara tercepat membuat thumbnail dan gradien profesional langsung di browser.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">Tools</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><Link href="/thumbnail" className="hover:text-green-600">Editor Thumbnail</Link></li>
                <li><Link href="/gradient-editor" className="hover:text-green-600">Generator Gradien</Link></li>
                <li><Link href="/tutorial" className="hover:text-green-600">Tutorial</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Ketentuan</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><Link href="/terms" className="hover:text-green-600">Syarat & Ketentuan</Link></li>
                <li><Link href="/privacy" className="hover:text-green-600">Kebijakan Privasi</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <p className="text-xs text-gray-500">© 2025 DesainCepat. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
