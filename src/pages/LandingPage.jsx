import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, CreditCard, Clock, CheckCircle, ArrowRight, Share2, Music, Images } from 'lucide-react'

const LandingPage = () => {
  const features = [
    { icon: <Heart size={24} />, title: 'Desain Elegan', desc: 'Tema premium yang elegan dan responsif untuk semua perangkat.' },
    { icon: <Music size={24} />, title: 'Musik Latar', desc: 'Putar lagu kenangan Anda secara otomatis saat undangan dibuka.' },
    { icon: <Clock size={24} />, title: 'Penghitung Mundur', desc: 'Tunggu hari besar Anda dengan penghitung waktu real-time.' },
    { icon: <Share2 size={24} />, title: 'Manajemen Tamu', desc: 'Buat link undangan khusus untuk setiap tamu dengan mudah.' },
    { icon: <Images size={24} />, title: 'Galeri Foto', desc: 'Tampilkan momen indah Anda dalam grid galeri yang cantik.' },
    { icon: <CreditCard size={24} />, title: 'Kado Digital', desc: 'Terima kado pernikahan secara aman melalui transfer bank atau e-wallet.' },
  ]

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-landing">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <h1>Abadikan Momen Bahagia Anda dengan <span className="text-gold">Undangan Digital</span></h1>
            <p>Buat undangan pernikahan eksklusif, mewah, dan ramah lingkungan hanya dalam hitungan menit.</p>
            <div className="hero-btns">
              <Link to="/login" className="btn-premium">Mulai Sekarang <ArrowRight size={18} /></Link>
              <a href="#features" className="btn-outline">Lihat Fitur</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section section">
        <div className="container">
          <div className="section-header">
            <h2>Fitur Premium Kami</h2>
            <p>Kami menyediakan berbagai fitur modern untuk melengkapi hari istimewa Anda.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div 
                key={i} 
                className="feature-card glass"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Action Section */}
      <section className="cta-section section">
        <div className="container">
          <motion.div 
            className="cta-card glass"
            whileInView={{ scale: [0.95, 1] }}
          >
            <h2>Siap Membuat Undangan Anda?</h2>
            <p>Gabung bersama ribuan pasangan yang telah mempercayakan undangan pernikahan mereka kepada kami.</p>
            <Link to="/login" className="btn-premium">Daftar / Login Sekarang</Link>
          </motion.div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2026 Jasa Undangan Digital Kayangan. All Rights Reserved.</p>
        </div>
      </footer>

      <style>{`
        .landing-container {
          background-color: var(--bg-cream);
          color: var(--text-dark);
        }
        .hero-landing {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(rgba(253, 251, 247, 0.8), rgba(253, 251, 247, 0.8)), url('https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
        }
        .hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 20px;
          line-height: 1.2;
        }
        .hero-content p {
          font-size: 1.2rem;
          color: var(--text-light);
          margin-bottom: 40px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .text-gold { color: var(--primary); }
        .hero-btns {
          display: flex;
          gap: 20px;
          justify-content: center;
        }
        .btn-outline {
          padding: 12px 32px;
          border: 2px solid var(--primary);
          color: var(--primary);
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition-smooth);
        }
        .btn-outline:hover {
          background: var(--primary);
          color: white;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        .feature-card {
          padding: 40px;
          border-radius: 20px;
          text-align: center;
        }
        .feature-icon {
          color: var(--primary);
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }
        .cta-card {
          padding: 80px 40px;
          border-radius: 30px;
          text-align: center;
          background: white;
        }
        .cta-card h2 { font-size: 2.5rem; margin-bottom: 20px; }
        .cta-card p { margin-bottom: 40px; color: var(--text-light); }
        .landing-footer {
          padding: 40px 0;
          text-align: center;
          border-top: 1px solid rgba(0,0,0,0.05);
          color: var(--text-light);
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.5rem; }
          .hero-btns { flex-direction: column; }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
