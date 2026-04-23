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
          
          <div className="notes-content">
            <div className="note-text-wrapper">
              <Info size={20} className="note-icon" />
              <p className="note-text">{notes}</p>
            </div>
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
          background: white !important; /* Force white background for contrast */
        }
        .notes-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
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
        .note-text-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          background: rgba(184, 134, 11, 0.05);
          border-radius: 15px;
        }
        .note-icon {
          color: var(--primary);
          margin-top: 4px;
          flex-shrink: 0;
        }
        .note-text {
          margin: 0;
          color: #2d3748 !important; /* Force dark color for visibility */
          line-height: 1.8;
          font-size: 1.05rem;
          white-space: pre-wrap; /* Preserve line breaks */
          word-break: break-word;
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
