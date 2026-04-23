import { motion } from 'framer-motion'

const Footer = ({ names, footerText, type = 'wedding' }) => {
  const labels = {
    wedding: { 
      quote: '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."',
      source: '(Ar-Rum: 21)',
      thanks: 'Terima kasih atas doa restunya.'
    },
    birthday: { 
      quote: '"Semoga hari ini menjadi awal dari tahun yang penuh dengan kebahagiaan, kesehatan, dan kesuksesan bagi kita semua."',
      source: '',
      thanks: 'Terima kasih telah merayakan hari spesial saya.'
    },
    meeting: { 
      quote: '"Kolaborasi dan komunikasi adalah kunci dari keberhasilan setiap misi besar yang kita emban bersama."',
      source: '',
      thanks: 'Terima kasih atas partisipasi dan dedikasi Anda.'
    },
    event: { 
      quote: '"Kehadiran Anda melengkapi kebahagiaan dan kesuksesan acara kami hari ini."',
      source: '',
      thanks: 'Terima kasih atas kehadiran Anda.'
    }
  }
  const current = labels[type] || labels.wedding

  return (
    <footer className="footer section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <p className="closing-quote">
            {current.quote}
          </p>
          {current.source && <p className="surah-info">{current.source}</p>}
          
          <div className="footer-couple">
            <h1>{names || 'Romeo & Juliet'}</h1>
            <p>{current.thanks}</p>
          </div>

          <div className="copyright">
            <p>&copy; 2026 {footerText || 'TARUNA BANGSA TANJUNGPINANG TEAM'}</p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .footer {
          background-color: var(--secondary);
          color: white;
          padding: 100px 0 50px;
        }
        .closing-quote {
          font-family: var(--font-heading);
          font-style: italic;
          font-size: 1.2rem;
          max-width: 700px;
          margin: 0 auto 10px;
          line-height: 1.8;
          color: var(--bg-cream);
        }
        .surah-info {
          margin-bottom: 50px;
          color: var(--primary-light);
          font-size: 0.9rem;
        }
        .footer-couple h1 {
          font-size: 3rem;
          margin-bottom: 20px;
          color: var(--primary-light);
        }
        .footer-couple p {
          color: var(--text-light);
          margin-bottom: 60px;
        }
        .copyright {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 30px;
          font-size: 0.8rem;
          color: var(--text-light);
        }
      `}</style>
    </footer>
  )
}

export default Footer
