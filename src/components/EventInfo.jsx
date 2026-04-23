import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, ExternalLink, ListChecks } from 'lucide-react'
import bgImage from '../assets/bg.png'
import { getDirectImageUrl } from '../utils/url'

const EventInfo = ({ events = [], type = 'wedding' }) => {
  const backgrounds = {
    wedding: bgImage,
    birthday: null,
    meeting: null,
    event: null
  }

  const currentBg = backgrounds[type] || bgImage

  const getEmbedUrl = (url) => {
    if (!url) return null
    if (url.includes('google.com/maps/embed')) return url
    if (url.includes('goo.gl/maps') || url.includes('google.com/maps')) {
      // Basic heuristic to try and make it embeddable, though direct links usually need API or specific formatting
      // For now, we'll just check if it's already an embed link or return null to fall back to the button
      return null
    }
    return null
  }

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
            Silakan catat jadwal dan lokasi acara di bawah ini.
          </motion.p>
        </div>

        <motion.div 
          className={`info-grid ${events.length === 1 ? 'single-event' : ''}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {events.map((event, index) => {
            const embedUrl = getEmbedUrl(event.mapUrl)
            
            return (
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
                  
                  <div className="card-body-inner">
                    <div className="card-content">
                      <div className="info-item">
                        <Calendar size={20} className="icon" />
                        <div className="item-text">
                          <label>Hari / Tanggal</label>
                          <span className="value">{event.date}</span>
                        </div>
                      </div>
                      <div className="info-item">
                        <Clock size={20} className="icon" />
                        <div className="item-text">
                          <label>Jam</label>
                          <span className="value">{event.time}</span>
                        </div>
                      </div>
                      {event.agenda && (
                        <div className="info-item">
                          <ListChecks size={20} className="icon" />
                          <div className="item-text">
                            <label>Agenda</label>
                            <span className="value">{event.agenda}</span>
                          </div>
                        </div>
                      )}
                      <div className="info-item">
                        <MapPin size={20} className="icon" />
                        <div className="item-text">
                          <label>Lokasi</label>
                          <span className="value">{event.location}</span>
                        </div>
                      </div>
                    </div>

                    {(embedUrl || event.mapImage || (event.mapUrl && event.mapUrl !== '#')) && (
                      <div className="card-map-section">
                        {embedUrl ? (
                          <div className="map-iframe-container">
                            <iframe 
                              src={embedUrl}
                              width="100%" 
                              height="100%" 
                              style={{ border: 0, borderRadius: '15px', minHeight: '200px' }} 
                              allowFullScreen="" 
                              loading="lazy" 
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        ) : event.mapImage ? (
                          <div className="map-preview" onClick={() => window.open(event.mapUrl, '_blank')}>
                            <img src={getDirectImageUrl(event.mapImage)} alt="Map Preview" />
                            <div className="map-overlay">
                              <ExternalLink size={24} />
                              <span>Buka Peta</span>
                            </div>
                          </div>
                        ) : (
                          <div className="map-preview fallback" onClick={() => window.open(event.mapUrl, '_blank')}>
                            <MapPin size={40} className="fallback-icon" />
                            <div className="map-overlay">
                              <ExternalLink size={24} />
                              <span>Buka Peta</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <style>{`
        .info-section {
          background-color: transparent !important;
          position: relative;
        }
        .info-section::before {
          display: none;
        }
        .container { position: relative; z-index: 1; }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 40px;
          justify-content: center;
        }
        .info-grid.single-event {
          max-width: 800px;
          margin: 0 auto;
        }
        .info-card {
          border-radius: 30px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(184, 134, 11, 0.1);
          transition: var(--transition-smooth);
          background: white !important; /* Force white background for contrast */
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
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 25px;
          flex: 1;
        }
        .card-header h3 {
          font-size: 1.8rem;
          color: var(--primary);
          margin-bottom: 0;
        }
        .card-body-inner {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .info-grid.single-event .card-body-inner {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 30px;
          align-items: stretch;
        }
        .card-content {
          display: flex;
          flex-direction: column;
          gap: 15px;
          text-align: left;
        }
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }
        .item-text {
          display: flex;
          flex-direction: column;
        }
        .item-text label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #718096; /* Consistent light gray */
          margin-bottom: 2px;
        }
        .item-text .value {
          color: #2d3748 !important; /* Force dark gray for visibility */
          font-weight: 600;
          font-size: 1rem;
        }
        .icon {
          color: var(--primary);
          margin-top: 2px;
          flex-shrink: 0;
        }
        .card-map-section {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .map-iframe-container {
          flex: 1;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          height: 100%;
          min-height: 200px;
        }
        .map-iframe-container iframe {
          height: 100%;
          min-height: 200px;
        }
        .map-preview {
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          height: 100%;
          min-height: 200px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(184, 134, 11, 0.05);
        }
        .map-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0; left: 0;
        }
        .map-preview.fallback .fallback-icon {
          color: var(--primary);
          opacity: 0.5;
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
          z-index: 2;
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
        .btn-premium.small {
          padding: 8px 20px;
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .info-grid { gap: 20px; }
          .card-body { padding: 25px 15px; }
          .card-header h3 { font-size: 1.6rem; }
          .info-grid.single-event .card-body-inner {
            grid-template-columns: 1fr;
          }
          .map-preview, .map-iframe-container iframe {
            min-height: 150px;
          }
        }
      `}</style>
    </section>
  )
}

export default EventInfo
