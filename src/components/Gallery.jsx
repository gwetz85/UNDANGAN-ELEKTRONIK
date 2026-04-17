import { motion } from 'framer-motion'
import g1 from '../assets/g1.png'
import g2 from '../assets/g2.png'
import g3 from '../assets/g3.png'
import g4 from '../assets/g4.png'
import couple from '../assets/couple.png'
import bg from '../assets/bg.png'

const Gallery = () => {
  const photos = [
    g1,
    g2,
    g3,
    g4,
    couple,
    bg,
  ]

  return (
    <section className="section gallery-section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Momen Spesial
        </motion.h2>
        
        <div className="gallery-grid">
          {photos.map((src, index) => (
            <motion.div 
              key={index}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, zIndex: 1 }}
            >
              <img src={src} alt={`Gallery ${index}`} />
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .gallery-section {
          background-color: var(--bg-cream);
        }
        .section-title {
          font-size: 2.5rem;
          margin-bottom: 50px;
          color: var(--secondary);
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          padding: 10px;
        }
        .gallery-item {
          aspect-ratio: 1/1;
          overflow: hidden;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </section>
  )
}

export default Gallery
