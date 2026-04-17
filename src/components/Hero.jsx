import { motion } from 'framer-motion'
import coupleImg from '../assets/couple.png'
import { getDirectImageUrl } from '../utils/url'

const Hero = ({ data = {}, type = 'wedding' }) => {
  const defaults = {
    wedding: { 
      title: 'MAHA SUCI ALLAH', 
      desc: 'Atas izin-Mu, kami mengundang Anda untuk merayakan hari bahagia kami.',
      image: coupleImg
    },
    birthday: { 
      title: 'HAPPY BIRTHDAY', 
      desc: 'Terima kasih telah menemani perjalanan hidup saya hingga saat ini.',
      image: 'https://images.unsplash.com/photo-1530103862676-fa8c9d3433b9?q=80&w=2070&auto=format&fit=crop'
    },
    meeting: { 
      title: 'OFFICIAL MEETING', 
      desc: 'Sinergi dan kolaborasi untuk mencapai tujuan bersama.',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2070&auto=format&fit=crop'
    },
    event: { 
      title: 'SPECIAL EVENT', 
      desc: 'Mari bergabung dan rayakan momen spesial ini bersama kami.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop'
    }
  }
  const current = defaults[type] || defaults.wedding

  return (
    <section className="hero-section">
      <div className="hero-image-container">
        <motion.div 
          className="hero-image"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ backgroundImage: `url(${getDirectImageUrl(data.image) || current.image})` }}
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-text">
        <motion.h4
          initial={{ opacity: 0, letterSpacing: '0px' }}
          whileInView={{ opacity: 1, letterSpacing: '4px' }}
          transition={{ duration: 1 }}
        >
          {data.title || current.title}
        </motion.h4>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {data.description || current.desc}
        </motion.p>
      </div>

      <style>{`
        .hero-section {
          height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 100px;
          overflow: hidden;
        }
        .hero-image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        .hero-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }
        .hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to top, var(--bg-cream) 0%, transparent 100%);
        }
        .hero-text {
          text-align: center;
          max-width: 600px;
          padding: 0 20px;
        }
        .hero-text h4 {
          color: var(--primary);
          margin-bottom: 20px;
          font-weight: 400;
        }
        .hero-text p {
          color: var(--text-light);
          font-style: italic;
        }
      `}</style>
    </section>
  )
}

export default Hero
