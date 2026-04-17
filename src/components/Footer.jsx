import { motion } from 'framer-motion'

const Footer = ({ names }) => {
  return (
    <footer className="footer section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <p className="closing-quote">
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
          </p>
          <p className="surah-info">(Ar-Rum: 21)</p>
          
          <div className="footer-couple">
            <h1>Romeo & Juliet</h1>
            <p>Terima kasih atas doa restunya.</p>
          </div>

          <div className="copyright">
            <p>&copy; 2026 Undangan Digital Premium. Created with ❤️</p>
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
