import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react'
import bgImage from '../assets/bg.png'
import { getDirectImageUrl } from '../utils/url'

const EventInfo = ({ events = [], type = 'wedding' }) => {
  const backgrounds = {
    wedding: bgImage,
    birthday: 'https://www.transparenttextures.com/patterns/food-patterns.png',
    meeting: 'https://www.transparenttextures.com/patterns/graphy.png',
    event: 'https://www.transparenttextures.com/patterns/bright-squares.png'
  }

  const currentBg = backgrounds[type] || bgImage

  return (
    <section className="section info-section">
      <div className="container">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Waktu & Lokasi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Kehadiran Anda adalah kado terindah bagi kami.
          </motion.p>
        </div>

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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              {event.locationImage && (
                <div className="event-image-top">
                  <img src={getDirectImageUrl(event.locationImage)} alt={event.title} />
                </div>
              )}
              
              <div className="card-body">
                <div className="card-header">
                  <h3>{event.title}</h3>
                </div>
                
                <div className="card-content">
                  <div className="info-item">
                    <Calendar size={20} className="icon" />
                    <div className="item-text">
                      <label>Tanggal</label>
                      <span>{event.date}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <Clock size={20} className="icon" />
                    <div className="item-text">
                      <label>Waktu</label>
                      <span>{event.time}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <MapPin size={20} className="icon" />
                    <div className="item-text">
                      <label>Lokasi</label>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                {event.mapImage && (
                  <div className="map-preview" onClick={() => window.open(event.mapUrl, '_blank')}>
                    <img src={getDirectImageUrl(event.mapImage)} alt="Map Preview" />
                    <div className="map-overlay">
                      <ExternalLink size={24} />
                      <span>Buka Peta</span>
                    </div>
                  </div>
                )}

                <button 
                  className="btn-premium"
                  onClick={() => window.open(event.mapUrl, '_blank')}
                >
                  <MapPin size={18} /> Petunjuk Lokasi
                </button>
              </div>
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
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          justify-content: center;
        }
        .info-card {
          border-radius: 30px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(184, 134, 11, 0.1);
          transition: var(--transition-smooth);
        }
        .info-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }
        .event-image-top {
          height: 200px;
          width: 100%;
          overflow: hidden;
        }
        .event-image-top img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .info-card:hover .event-image-top img {
          transform: scale(1.1);
        }
        .card-body {
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 30px;
          flex: 1;
        }
        .card-header h3 {
          font-size: 2.2rem;
          color: var(--primary);
          margin-bottom: 0;
        }
        .card-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }
        .item-text {
          display: flex;
          flex-direction: column;
        }
        .item-text label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-light);
          margin-bottom: 5px;
        }
        .item-text span {
          color: var(--text-dark);
          font-weight: 500;
          font-size: 1.1rem;
        }
        .icon {
          color: var(--primary);
          margin-top: 2px;
        }
        .map-preview {
          position: relative;
          height: 150px;
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          margin-top: 10px;
        }
        .map-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .map-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(184, 134, 11, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s;
          backdrop-filter: blur(2px);
        }
        .map-preview:hover .map-overlay {
          opacity: 1;
        }
        .map-overlay span {
          font-size: 0.8rem;
          font-weight: 600;
          margin-top: 5px;
        }
        .btn-premium {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
        }
        @media (max-width: 768px) {
          .info-grid { gap: 20px; }
          .card-body { padding: 30px 20px; }
          .card-header h3 { font-size: 1.8rem; }
        }
      `}</style>
    </section>
  )
}

export default EventInfo
