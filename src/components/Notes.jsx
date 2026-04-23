import { motion } from 'framer-motion'
import { Info, MessageSquareText } from 'lucide-react'

const Notes = ({ notes = [], type = 'meeting' }) => {
  if (!notes || notes.length === 0) return null

  const titles = {
    wedding: 'Catatan Penting',
    birthday: 'Catatan Acara',
    meeting: 'Catatan Rapat',
    event: 'Informasi Tambahan'
  }

  return (
    <section className="section notes-section">
      <div className="container">
        <motion.div 
          className="notes-container glass"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="notes-header">
            <MessageSquareText size={24} className="icon" />
            <h2>{titles[type] || titles.meeting}</h2>
          </div>
          
          <div className="notes-list">
            {notes.map((note, index) => (
              <motion.div 
                key={index}
                className="note-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Info size={18} className="note-icon" />
                <p>{note}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .notes-section {
          padding-top: 0 !important;
          background: transparent !important;
        }
        .notes-container {
          padding: 40px;
          border-radius: 30px;
          text-align: left;
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid rgba(184, 134, 11, 0.1);
        }
        .notes-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(184, 134, 11, 0.1);
        }
        .notes-header h2 {
          font-size: 1.8rem;
          color: var(--primary);
          margin: 0;
        }
        .notes-header .icon {
          color: var(--primary);
        }
        .notes-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .note-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px;
          background: rgba(184, 134, 11, 0.05);
          border-radius: 15px;
          transition: transform 0.3s ease;
        }
        .note-item:hover {
          transform: translateX(5px);
        }
        .note-icon {
          color: var(--primary);
          margin-top: 3px;
          flex-shrink: 0;
        }
        .note-item p {
          margin: 0;
          color: var(--text-dark);
          line-height: 1.6;
          font-size: 1rem;
        }
        @media (max-width: 768px) {
          .notes-container { padding: 25px 20px; }
          .notes-header h2 { font-size: 1.5rem; }
          .note-item { padding: 12px; }
          .note-item p { font-size: 0.95rem; }
        }
      `}</style>
    </section>
  )
}

export default Notes
