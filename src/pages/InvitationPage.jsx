import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Loader2 } from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { db } from '../firebase'
import { ref, onValue } from 'firebase/database'
import Hero from '../components/Hero'
import Countdown from '../components/Countdown'
import WeddingInfo from '../components/WeddingInfo'
import Gallery from '../components/Gallery'
import RSVP from '../components/RSVP'
import Gift from '../components/Gift'
import Footer from '../components/Footer'
import { useRef } from 'react'
import bgImage from '../assets/bg.png'

function InvitationPage() {
  const { weddingSlug } = useParams()
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [guestName, setGuestName] = useState('Tamu Undangan')
  const [weddingData, setWeddingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    if (to) setGuestName(to)

    // Fetch Wedding Data
    const weddingRef = ref(db, `weddings/${weddingSlug}`)
    const unsubscribe = onValue(weddingRef, (snapshot) => {
      setWeddingData(snapshot.val())
      setLoading(false)
    })

    return () => unsubscribe()
  }, [weddingSlug])

  const handleOpen = () => {
    setIsOpen(true)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e))
    }
  }

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  if (loading) {
    return (
      <div className="status-container">
        <Loader2 className="animate-spin" size={48} color="#b8860b" />
        <p>Memuat Undangan...</p>
      </div>
    )
  }

  if (!weddingData) {
    return (
      <div className="status-container">
        <h2>Undangan Tidak Ditemukan</h2>
        <p>Maaf, tautan yang Anda berikan tidak valid.</p>
        <Link to="/" className="btn-premium">Kembali ke Beranda</Link>
      </div>
    )
  }

  const { theme = {}, config = {} } = weddingData

  return (
    <div className="app-container">
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            className="cover-overlay glass"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ backgroundImage: `url(${config.coverImage || bgImage})` }}
          >
            <div className="cover-content">
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                THE WEDDING OF
              </motion.h4>
              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {config.coupleNames || 'Romeo & Juliet'}
              </motion.h1>
              <div className="guest-box">
                <p>Kepada Bapak/Ibu/Saudara/i:</p>
                <h3>{guestName}</h3>
              </div>
              <button className="btn-premium" onClick={handleOpen}>
                Buka Undangan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Hero data={config.hero} />
          <Countdown targetDate={config.weddingDate} />
          <WeddingInfo events={config.events} />
          <Gallery photos={config.gallery} />
          <Gift accounts={config.bankAccounts} />
          <RSVP weddingSlug={weddingSlug} />
          <Footer names={config.coupleNames} />

          <audio 
            ref={audioRef}
            src={config.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} 
            loop 
          />

          <div className="music-control">
            <button 
              className="music-btn glass"
              onClick={toggleMusic}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            {isPlaying && (
              <div className="audio-visualizer">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            )}
          </div>
        </motion.main>
      )}

      <style>{`
        .app-container {
          min-height: 100vh;
          position: relative;
        }
        .cover-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-cream);
          background-image: url('${bgImage}');
          background-size: cover;
          background-position: center;
        }
        .cover-content {
          text-align: center;
          padding: 40px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          max-width: 500px;
          width: 90%;
        }
        .cover-content h4 {
          letter-spacing: 4px;
          color: var(--primary);
          margin-bottom: 20px;
        }
        .cover-content h1 {
          font-size: 3.5rem;
          margin-bottom: 30px;
          color: var(--secondary);
        }
        .guest-box {
          margin-bottom: 40px;
          padding: 20px;
          border-top: 1px solid var(--primary-light);
          border-bottom: 1px solid var(--primary-light);
        }
        .guest-box p {
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 10px;
        }
        .music-control {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 900;
        }
        .music-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          cursor: pointer;
        }
        .audio-visualizer {
          display: flex;
          align-items: flex-end;
          gap: 3px;
          height: 20px;
        }
        .bar {
          width: 3px;
          background: var(--primary);
          animation: bounce 1s ease-in-out infinite;
        }
        .bar:nth-child(2) { animation-delay: 0.2s; }
        .bar:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 100% { height: 5px; }
          50% { height: 100%; }
        }
        .status-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: var(--text-dark);
          text-align: center;
          padding: 20px;
        }
        .status-container h2 { color: var(--primary); }
      `}</style>
    </div>
  )
}

export default InvitationPage
