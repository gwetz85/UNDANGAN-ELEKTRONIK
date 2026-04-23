import { motion } from 'framer-motion'
import g1 from '../assets/g1.png'
import g2 from '../assets/g2.png'
import g3 from '../assets/g3.png'
import g4 from '../assets/g4.png'
import couple from '../assets/couple.png'
import bg from '../assets/bg.png'
import { getDirectImageUrl } from '../utils/url'

const Gallery = ({ photos = [] }) => {
  const defaultPhotos = [g1, g2, g3, g4, couple, bg]
  const displayPhotos = (photos?.length > 0 ? photos : defaultPhotos).map(src => getDirectImageUrl(src))

  // Duplicate photos for infinite marquee effect
  const marqueePhotos = [...displayPhotos, ...displayPhotos, ...displayPhotos]

  return (
    <section className="section gallery-section">
      <div className="gallery-header">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Momen Spesial
        </motion.h2>
      </div>

      <div className="marquee-container">
        <motion.div 
          className="marquee-track"
          animate={{ x: [0, -100 * displayPhotos.length] }}
          transition={{ 
            duration: displayPhotos.length * 5, // Speed adjustment
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {marqueePhotos.map((src, index) => (
            <div key={index} className="gallery-item">
              <img src={src} alt={`Gallery ${index}`} loading="lazy" />
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .gallery-section {
          background-color: transparent !important;
          padding: 80px 0;
          overflow: hidden;
        }
        .gallery-header {
          padding: 0 20px;
          margin-bottom: 40px;
        }
        .section-title {
          font-size: 2.5rem;
          color: var(--secondary);
          text-align: center;
        }
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 20px 0;
        }
        .marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
        }
        .gallery-item {
          width: 300px;
          height: 400px;
          flex-shrink: 0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 4px solid white;
        }
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        @media (max-width: 768px) {
          .gallery-item {
            width: 200px;
            height: 280px;
          }
          .section-title { font-size: 2rem; }
        }
      `}</style>
    </section>
  )
}

export default Gallery
