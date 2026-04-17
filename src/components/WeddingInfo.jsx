import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock } from 'lucide-react'
import bgImage from '../assets/bg.png'

const WeddingInfo = () => {
  const events = [
    {
      title: 'Akad Nikah',
      date: 'Minggu, 31 Desember 2026',
      time: '09:00 - 11:00 WIB',
      location: 'Kediaman Mempelai Wanita, Jl. Mawar No. 123, Jakarta',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Jl.+Mawar+No.+123+Jakarta'
    },
    {
      title: 'Resepsi',
      date: 'Minggu, 31 Desember 2026',
      time: '12:00 - 16:00 WIB',
      location: 'Grand Ballroom Hotel Mulia, Jakarta',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Mulia+Jakarta'
    }
  ]

  return (
    <section className="section info-section">
      <div className="container">
        <motion.div 
          className="info-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {events.map((event, index) => (
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
          background-image: url('${bgImage}');
          background-size: cover;
          background-attachment: fixed;
          background-position: center;
        }
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

export default WeddingInfo
