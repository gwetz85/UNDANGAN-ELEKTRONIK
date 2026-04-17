import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { db } from '../firebase'
import { ref, push, onValue, query, orderByChild, serverTimestamp } from 'firebase/database'

const RSVP = ({ weddingSlug }) => {
  const [formData, setFormData] = useState({
    name: '',
    attendance: 'Hadir',
    message: ''
  })
  const [wishes, setWishes] = useState([])

  useEffect(() => {
    if (!weddingSlug) return
    const rsvpRef = query(ref(db, `weddings/${weddingSlug}/rsvps`), orderByChild('createdAt'))
    const unsubscribe = onValue(rsvpRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        // Convert object to array and sort desc
        const wishList = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          date: data[key].createdAt ? new Date(data[key].createdAt).toLocaleString() : 'Baru saja'
        })).reverse()
        setWishes(wishList)
      } else {
        setWishes([])
      }
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.name && formData.message && weddingSlug) {
      try {
        const rsvpRef = ref(db, `weddings/${weddingSlug}/rsvps`)
        await push(rsvpRef, {
          ...formData,
          createdAt: serverTimestamp()
        })
        setFormData({ name: '', attendance: 'Hadir', message: '' })
        alert('Terima kasih! Pesan Anda telah terkirim.')
      } catch (error) {
        console.error("Error adding document: ", error)
        alert('Gagal mengirim pesan. Coba lagi nanti.')
      }
    }
  }

  return (
    <section className="section rsvp-section">
      <div className="container">
        <div className="rsvp-layout">
          <motion.div 
            className="rsvp-form-container glass"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3>Konfirmasi Kehadiran</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Nama Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <select 
                  value={formData.attendance}
                  onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                >
                  <option value="Hadir">Hadir</option>
                  <option value="Tidak Hadir">Tidak Hadir</option>
                  <option value="Masih Ragu">Masih Ragu</option>
                </select>
              </div>
              <div className="form-group">
                <textarea 
                  placeholder="Ucapan & Doa Restu"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-premium">
                Kirim Pesan <Send size={16} />
              </button>
            </form>
          </motion.div>

          <motion.div 
            className="wishes-container"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h3>Doa Restu</h3>
            <div className="wishes-list">
              {wishes.map((wish, index) => (
                <div key={index} className="wish-card glass">
                  <div className="wish-header">
                    <strong>{wish.name}</strong>
                    <span className="attendance-tag">{wish.attendance}</span>
                  </div>
                  <p>{wish.message}</p>
                  <small>{wish.date}</small>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .rsvp-section { background-color: var(--white); }
        .rsvp-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          text-align: left;
        }
        .rsvp-form-container, .wishes-container {
          padding: 40px;
          border-radius: 20px;
        }
        h3 {
          font-size: 1.8rem;
          margin-bottom: 30px;
          color: var(--primary);
        }
        .form-group { margin-bottom: 20px; }
        input, select, textarea {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid rgba(184, 134, 11, 0.2);
          border-radius: 10px;
          font-family: var(--font-body);
          background: rgba(255,255,255,0.8);
        }
        .wishes-list {
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding-right: 10px;
        }
        .wish-card {
          padding: 20px;
          border-radius: 15px;
        }
        .wish-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .attendance-tag {
          font-size: 0.7rem;
          background: var(--primary-light);
          color: white;
          padding: 2px 8px;
          border-radius: 20px;
        }
        small { color: var(--text-light); }
        @media (max-width: 992px) {
          .rsvp-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}

export default RSVP
