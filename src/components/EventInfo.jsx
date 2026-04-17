import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock } from 'lucide-react'
import bgImage from '../assets/bg.png'

const EventInfo = ({ events = [], type = 'wedding' }) => {
  const presets = {
    wedding: [
      { title: 'Akad Nikah', date: 'Minggu, 31 Desember 2026', time: '09:00 - 11:00 WIB', location: 'Kediaman Mempelai Wanita', mapUrl: '#' },
      { title: 'Resepsi', date: 'Minggu, 31 Desember 2026', time: '12:00 - 16:00 WIB', location: 'Grand Ballroom Hotel', mapUrl: '#' }
    ],
    birthday: [
      { title: 'Tiup Lilin & Doa', date: 'Sabtu, 15 Mei 2026', time: '16:00 - 18:00 WIB', location: 'Kediaman Utama', mapUrl: '#' },
      { title: 'Ramah Tamah', date: 'Sabtu, 15 Mei 2026', time: '18:00 - Selesai', location: 'Halaman Belakang', mapUrl: '#' }
    ],
    meeting: [
      { title: 'Sesi Pembukaan', date: 'Senin, 10 Juni 2026', time: '09:00 - 10:00 WIB', location: 'Ruang Rapat Utama', mapUrl: '#' },
      { title: 'Diskusi & Tanya Jawab', date: 'Senin, 10 Juni 2026', time: '10:00 - 12:00 WIB', location: 'Ruang Rapat Utama', mapUrl: '#' }
    ],
    event: [
      { title: 'Acara Utama', date: 'Jumat, 20 Juli 2026', time: '19:00 - Selesai', location: 'Venue Utama', mapUrl: '#' }
    ]
  }

  const backgrounds = {
    wedding: bgImage, // Floral pattern
    birthday: 'https://www.transparenttextures.com/patterns/food-patterns.png',
    meeting: 'https://www.transparenttextures.com/patterns/graphy.png',
    event: 'https://www.transparenttextures.com/patterns/bright-squares.png'
  }

  const currentBg = backgrounds[type] || bgImage

  return (
    <section className="section info-section">
      <div className="container">
        <motion.div 
          className="info-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {(events.length > 0 ? events : defaultEvents).map((event, index) => (
            <motion.div 
              key={index}
              className="info-card glass"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-header">
                <h3>{event.title}</h3>
              </div>
              <div className="card-content">
                <div className="info-item">
                  <Calendar size={18} className="icon" />
                  <span>{event.date}</span>
                </div>
                <div className="info-item">
                  <Clock size={18} className="icon" />
                  <span>{event.time}</span>
                </div>
                <div className="info-item">
                  <MapPin size={18} className="icon" />
                  <span>{event.location}</span>
                </div>
              </div>
              <button 
                className="btn-premium"
                onClick={() => window.open(event.mapUrl, '_blank')}
              >
                Petunjuk Lokasi
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .info-section {
          background-image: url('${currentBg}');
          background-size: initial;
          background-repeat: repeat;
          background-attachment: fixed;
          background-position: center;
          position: relative;
        }
        .info-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(var(--bg-cream-rgb), 0.3);
          z-index: 0;
        }
        .container { position: relative; z-index: 1; }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
        }
        .info-card {
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .card-header h3 {
          font-size: 2rem;
          color: var(--primary);
        }
        .card-content {
          display: flex;
          flex-direction: column;
          gap: 15px;
          text-align: left;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 15px;
          color: var(--text-dark);
          font-size: 0.95rem;
        }
        .icon {
          color: var(--primary);
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .info-grid { gap: 20px; }
          .info-card { padding: 30px 20px; }
        }
      `}</style>
    </section>
  )
}

export default EventInfo
