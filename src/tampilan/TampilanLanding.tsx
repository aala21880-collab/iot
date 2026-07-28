import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from '../types';
import { LogoAgriSteward } from '../komponen/LogoAgriSteward';
import {
  Radio,
  PlayCircle,
  Droplets,
  Activity,
  Map,
  Mail,
  Smartphone,
  Cpu,
  Wifi,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
  Send
} from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';

interface TampilanLandingProps {
  onGoToApp: (view?: ViewType) => void;
}

export const TampilanLanding: React.FC<TampilanLandingProps> = ({ onGoToApp }) => {
  const [activeTab, setActiveTab] = useState<'beranda' | 'fitur' | 'teknologi' | 'kontak'>('beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Handle smooth scroll with top offset
  const scrollToSection = (id: 'beranda' | 'fitur' | 'teknologi' | 'kontak') => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll listener to update active tab based on view position
  useEffect(() => {
    const handleScroll = () => {
      const sections: Array<'beranda' | 'fitur' | 'teknologi' | 'kontak'> = ['beranda', 'fitur', 'teknologi', 'kontak'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactForm({ name: '', email: '', message: '' });
        setContactSubmitted(false);
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] font-sans selection:bg-[#a6f2d1] selection:text-[#004532]">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 w-full h-16 bg-[#f9f9ff]/95 backdrop-blur-md shadow-xs border-b border-[#bec9c2]/30">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onGoToApp('dashboard')}>
          <LogoAgriSteward className="w-9 h-9" />
          <h1 className="font-bold text-xl text-[#004532]">AGRI STEWARD</h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-semibold">
          {[
            { id: 'beranda' as const, label: 'Beranda' },
            { id: 'fitur' as const, label: 'Fitur' },
            { id: 'teknologi' as const, label: 'Teknologi' },
            { id: 'kontak' as const, label: 'Kontak' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'text-[#004532] font-bold' : 'text-[#3f4944] hover:text-[#004532]'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="landingNavActiveIndicator"
                    className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#004532] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onGoToApp('login')}
            className="hidden md:flex items-center gap-1 text-sm font-semibold text-[#3f4944] hover:text-[#004532] px-3 py-1.5 transition-colors"
          >
            Masuk
          </button>
          <button
            onClick={() => onGoToApp('dashboard')}
            className="bg-[#004532] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-2"
          >
            <span>Mulai Sekarang</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#004532] hover:bg-[#f0f3ff] rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Nav Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-[#bec9c2]/40 shadow-xl px-6 py-4 space-y-2"
          >
            {[
              { id: 'beranda' as const, label: 'Beranda' },
              { id: 'fitur' as const, label: 'Fitur' },
              { id: 'teknologi' as const, label: 'Teknologi' },
              { id: 'kontak' as const, label: 'Kontak' },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative w-full text-left py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'text-[#004532]' : 'text-[#3f4944]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileLandingNavIndicator"
                      className="absolute inset-0 bg-[#a6f2d1]/40 rounded-xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onGoToApp('login');
                }}
                className="flex-1 py-2 text-center text-xs font-bold text-[#004532] border border-[#004532] rounded-lg"
              >
                Masuk
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onGoToApp('dashboard');
                }}
                className="flex-1 py-2 text-center text-xs font-bold text-white bg-[#004532] rounded-lg shadow-xs"
              >
                Aplikasi Dasbor
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Beranda / Hero Section */}
        <section id="beranda" className="relative min-h-[85vh] flex items-center overflow-hidden py-12 md:py-20">
          {/* Background Decoration */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-[#c6e9c7]/20 rounded-bl-[200px] -z-10" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#a6f2d1]/30 rounded-full blur-3xl -z-10" />
          </div>

          <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a6f2d1] text-[#00513b] font-semibold text-xs tracking-wider uppercase w-fit">
                <Radio className="w-4 h-4" />
                <span>TEKNOLOGI PERTANIAN 4.0</span>
              </div>

              <h2 className="font-extrabold text-3xl md:text-5xl lg:text-6xl text-[#004532] leading-tight">
                Optimalkan Hasil Panen Padi dengan <span className="text-[#47664b]">Monitoring IoT</span> Real-time
              </h2>

              <p className="text-base md:text-lg text-[#3f4944] leading-relaxed">
                Pantau kesehatan lahan, kualitas air, dan kondisi tanah secara akurat. Ubah data menjadi keputusan tepat untuk efisiensi produksi padi yang berkelanjutan.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onGoToApp('dashboard')}
                  className="bg-[#065f46] text-[#8bd6b7] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#004532] hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  Mulai Sekarang
                </button>
                <button
                  onClick={() => onGoToApp('dashboard')}
                  className="flex items-center gap-2 px-6 py-4 bg-white border border-[#bec9c2] hover:bg-[#e2e8f8] text-[#004532] font-bold text-base rounded-xl transition-all shadow-xs"
                >
                  <PlayCircle className="w-5 h-5 text-[#004532]" />
                  <span>Lihat Demo Aplikasi</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-900 group">
                <img
                  src={HERO_IMAGE}
                  alt="Persawahan Digital"
                  className="w-full h-[400px] md:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="bg-[#a6f2d1] text-[#00513b] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Monitoring Sektor Padi Subang
                  </span>
                  <p className="font-bold text-lg">Kelembapan Lahan & pH Otomatis Beroperasi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fitur Highlights Section */}
        <section id="fitur" className="py-16 bg-white border-y border-[#bec9c2]/30">
          <div className="container mx-auto px-6 md:px-12 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#004532]">FITUR UNGGULAN</span>
              <h3 className="font-extrabold text-3xl text-[#151c27]">Solusi Terpadu untuk Lahan Padi Anda</h3>
              <p className="text-sm text-[#3f4944]">
                Teknologi pintar dirancang khusus untuk memenuhi kebutuhan pengawasan lahan pertanian Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-[#f0f3ff] border border-[#bec9c2]/40 space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#004532] text-white flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-[#a6f2d1]" />
                </div>
                <h4 className="font-bold text-xl text-[#004532]">Sensor Kelembapan & Irigasi</h4>
                <p className="text-xs text-[#3f4944] leading-relaxed">
                  Deteksi dini kondisi air pada tanah sawah untuk mencegah kekeringan atau genangan berlebih secara otomatis.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f0f3ff] border border-[#bec9c2]/40 space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#004532] text-white flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#a6f2d1]" />
                </div>
                <h4 className="font-bold text-xl text-[#004532]">Analisis Nutrisi NPK & pH</h4>
                <p className="text-xs text-[#3f4944] leading-relaxed">
                  Ukur kadar Nitrogen, Fosfor, dan Kalium secara langsung dari akar tanaman untuk efisiensi pemupukan.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#f0f3ff] border border-[#bec9c2]/40 space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#004532] text-white flex items-center justify-center">
                  <Map className="w-6 h-6 text-[#a6f2d1]" />
                </div>
                <h4 className="font-bold text-xl text-[#004532]">Peta Spasial GIS Subang</h4>
                <p className="text-xs text-[#3f4944] leading-relaxed">
                  Visualisasikan seluruh blok persawahan Anda dalam peta interaktif berbasis koordinat geografis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Teknologi Section */}
        <section id="teknologi" className="py-20 bg-[#f0f4f1] border-b border-[#bec9c2]/30">
          <div className="container mx-auto px-6 md:px-12 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#004532]">ARSITEKTUR TEKNOLOGI</span>
              <h3 className="font-extrabold text-3xl md:text-4xl text-[#004532]">Inovasi Agrotech Presisi Cerdas</h3>
              <p className="text-sm text-[#3f4944]">
                Infrastruktur jaringan sensor nirkabel berdaya surya dengan Sinkronisasi Cloud & Analisis AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#bec9c2]/40 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#a6f2d1] text-[#004532] flex items-center justify-center">
                  <Wifi className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-[#004532]">LoRaWAN Mesh Wireless</h4>
                <p className="text-xs text-[#3f4944] leading-relaxed">
                  Jangkauan transmisi sinyal hingga 5 km antar pematang sawah tanpa hambatan sinyal seluler.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#bec9c2]/40 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#a6f2d1] text-[#004532] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-[#004532]">Pemrosesan Edge AI</h4>
                <p className="text-xs text-[#3f4944] leading-relaxed">
                  Perangkat mikrokontroler mandiri menghitung ambang batas batas irigasi secara cepat di lapangan.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#bec9c2]/40 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#a6f2d1] text-[#004532] flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-[#004532]">Daya Surya & Baterai</h4>
                <p className="text-xs text-[#3f4944] leading-relaxed">
                  Panel surya terintegrasi menjamin operasional sensor nonstop 24 jam tanpa perlu steker listrik.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#bec9c2]/40 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[#a6f2d1] text-[#004532] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-lg text-[#004532]">Proteksi Tahan Cuaca IP67</h4>
                <p className="text-xs text-[#3f4944] leading-relaxed">
                  Casing waterproof & korosi siap menghadapi panas terik, lumpur persawahan, hingga hujan deras.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Kontak Section */}
        <section id="kontak" className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#004532]">HUBUNGI KAMI</span>
              <h3 className="font-extrabold text-3xl md:text-4xl text-[#151c27]">
                Siap Mentransformasi Lahan Pertanian Anda?
              </h3>
              <p className="text-sm text-[#3f4944] leading-relaxed">
                Tim ahli Agri Steward siap membantu pemasangan sensor IoT, konsultasi nutrisi tanah, dan demonstrasi perangkat di persawahan Anda.
              </p>

              <div className="space-y-4 pt-2 text-sm text-[#004532]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f0f3ff] flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#004532]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#3f4944]">Email Resmi</p>
                    <p className="font-bold">support@agristeward.id</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f0f3ff] flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-[#004532]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#3f4944]">WhatsApp & Layanan 24/7</p>
                    <p className="font-bold">+62 819-1735-4944</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="p-8 rounded-3xl bg-[#f0f3ff] border border-[#bec9c2]/40 shadow-sm space-y-4">
              <h4 className="font-bold text-xl text-[#004532]">Formulir Konsultasi Lahan</h4>
              {contactSubmitted ? (
                <div className="p-6 bg-[#a6f2d1]/40 border border-[#004532]/20 rounded-2xl flex flex-col items-center text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-[#004532]" />
                  <p className="font-bold text-sm text-[#004532]">Pesan Anda Berhasil Terkirim!</p>
                  <p className="text-xs text-[#3f4944]">Tim teknis Agri Steward akan menghubungi Anda dalam kurun waktu 1x24 jam.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#3f4944] mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pak Pertiwi"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#bec9c2]/60 bg-white text-xs focus:outline-none focus:border-[#004532]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3f4944] mb-1">Email / No. WhatsApp</label>
                    <input
                      type="text"
                      required
                      placeholder="email@contoh.id atau 0812xxx"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#bec9c2]/60 bg-white text-xs focus:outline-none focus:border-[#004532]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3f4944] mb-1">Pesan / Lokasi Lahan</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Sebutkan luas lahan & pertanyaan seputar teknologi IoT..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#bec9c2]/60 bg-white text-xs focus:outline-none focus:border-[#004532]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#004532] text-white font-bold text-xs rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan Konsultasi</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#004532] text-white py-12 px-6 md:px-12 border-t border-[#a6f2d1]/20">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <LogoAgriSteward className="w-8 h-8" />
              <h4 className="font-bold text-xl text-white">AGRI STEWARD</h4>
            </div>
            <p className="text-xs text-[#a6f2d1]/80 leading-relaxed">
              Platform Stewardship Pertanian Digital Indonesia. Terhubung, Akurat, dan Berkelanjutan.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-sm text-[#a6f2d1]">Kontak Dukungan</h5>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#a6f2d1]" />
              <span>support@agristeward.id</span>
            </p>
            <p className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#a6f2d1]" />
              <span>+62 819-1735-4944</span>
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h5 className="font-bold text-sm text-[#a6f2d1]">Sumenep Technology Hub</h5>
            <p className="text-[#a6f2d1]/80">Jl. PP.Annuqayah Guluk No.184, Guluk Guluk Timur I, Guluk-guluk, Kec. Guluk-Guluk, Kabupaten Sumenep, Jawa Timur 69463</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

