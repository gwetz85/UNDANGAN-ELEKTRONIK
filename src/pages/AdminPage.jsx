import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, MessageSquare, Plus, Trash2, Copy, Check, LogOut, ExternalLink, ChevronLeft, LayoutDashboard } from 'lucide-react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { db } from '../firebase'
import { ref, push, onValue, remove, serverTimestamp, query, orderByChild } from 'firebase/database'

const AdminPage = () => {
  const navigate = useNavigate()
  const { weddingSlug } = useParams()
  const [activeTab, setActiveTab] = useState('guests')
  const [weddings, setWeddings] = useState([])
  const [guests, setGuests] = useState([])
  const [rsvps, setRsvps] = useState([])
  const [newGuestName, setNewGuestName] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)

  useEffect(() => {
    if (!weddingSlug) {
      // Fetch all weddings for the global dashboard
      const weddingsRef = ref(db, 'weddings')
      const unsub = onValue(weddingsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setWeddings(Object.keys(data).map(key => ({ 
            slug: key, 
            coupleNames: data[key]?.config?.coupleNames || key,
            guestCount: Object.keys(data[key]?.guests || {}).length,
            rsvpCount: Object.keys(data[key]?.rsvps || {}).length
          })))
        } else {
          setWeddings([])
        }
      })
      return () => unsub()
    }

    // Listen to Guests for a specific wedding
    const guestRef = query(ref(db, `weddings/${weddingSlug}/guests`), orderByChild('createdAt'))
    const unsubGuests = onValue(guestRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setGuests(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse())
      } else {
        setGuests([])
      }
    })

    // Listen to RSVPs for a specific wedding
    const rsvpRef = query(ref(db, `weddings/${weddingSlug}/rsvps`), orderByChild('createdAt'))
    const unsubRsvps = onValue(rsvpRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setRsvps(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse())
      } else {
        setRsvps([])
      }
    })

    return () => {
      unsubGuests()
      unsubRsvps()
    }
  }, [weddingSlug])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    navigate('/login')
  }

  const addGuest = async (e) => {
    e.preventDefault()
    if (!newGuestName.trim() || !weddingSlug) return
    try {
      await push(ref(db, `weddings/${weddingSlug}/guests`), {
        name: newGuestName,
        createdAt: serverTimestamp()
      })
      setNewGuestName('')
    } catch (error) {
      console.error("Error adding guest:", error)
    }
  }

  const deleteGuest = async (id) => {
    if (window.confirm('Hapus tamu ini?') && weddingSlug) {
      try {
        await remove(ref(db, `weddings/${weddingSlug}/guests/${id}`))
      } catch (error) {
        console.error("Error deleting guest:", error)
      }
    }
  }

  const copyLink = (name, index) => {
    const baseUrl = window.location.origin
    const link = `${baseUrl}/${weddingSlug}?to=${encodeURIComponent(name)}`
    navigator.clipboard.writeText(link)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const stats = {
    totalGuests: guests.length,
    totalRSVP: rsvps.length,
    attending: rsvps.filter(r => r.attendance === 'Hadir').length
  }

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
          <p>Wedding Admin</p>
        </div>
        <nav>
          <button 
            className={!weddingSlug ? 'active' : ''} 
            onClick={() => navigate('/admin')}
          >
            <LayoutDashboard size={20} /> Semua Undangan
          </button>
          
          {weddingSlug && (
            <>
              <div className="sidebar-divider">Kelola: {weddingSlug}</div>
              <button 
                className={activeTab === 'guests' ? 'active' : ''} 
                onClick={() => setActiveTab('guests')}
              >
                <Users size={20} /> Manajemen Tamu
              </button>
              <button 
                className={activeTab === 'rsvp' ? 'active' : ''} 
                onClick={() => setActiveTab('rsvp')}
              >
                <MessageSquare size={20} /> Daftar RSVP
              </button>
            </>
          )}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="main-header">
          {weddingSlug ? (
            <div className="header-top">
              <button className="back-link" onClick={() => navigate('/admin')}>
                <ChevronLeft size={20} /> Kembali ke Daftar
              </button>
              <div className="stats-grid">
                <div className="stat-card glass">
                  <span>Total Tamu</span>
                  <h3>{stats.totalGuests}</h3>
                </div>
                <div className="stat-card glass">
                  <span>Total RSVP</span>
                  <h3>{stats.totalRSVP}</h3>
                </div>
                <div className="stat-card glass">
                  <span>Hadir</span>
                  <h3>{stats.attending}</h3>
                </div>
              </div>
            </div>
          ) : (
            <h1>Semua Undangan Aktif</h1>
          )}
        </header>

        {!weddingSlug ? (
          <div className="wedding-list">
            {weddings.length === 0 ? (
              <div className="card glass empty-state">
                <p>Belum ada undangan yang dibuat di database.</p>
                <p className="hint">Silakan tambahkan data di Firebase Console bawah node <code>weddings/</code></p>
              </div>
            ) : (
              <div className="wedding-grid">
                {weddings.map(w => (
                  <div key={w.slug} className="card glass wedding-card">
                    <h3>{w.coupleNames}</h3>
                    <div className="wedding-stats">
                      <span>{w.guestCount} Tamu</span>
                      <span>{w.rsvpCount} RSVP</span>
                    </div>
                    <div className="wedding-actions">
                      <button className="btn-secondary" onClick={() => navigate(`/admin/${w.slug}`)}>
                        Kelola
                      </button>
                      <a href={`/${w.slug}`} target="_blank" rel="noreferrer" className="btn-icon">
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          activeTab === 'guests' ? (
          <div className="tab-content">
            <div className="card glass">
              <div className="card-header">
                <h3>Tambah Tamu</h3>
              </div>
              <form className="add-guest-form" onSubmit={addGuest}>
                <input 
                  type="text" 
                  placeholder="Nama Tamu (Contoh: Budi Santoso)"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                />
                <button type="submit" className="btn-premium">
                  <Plus size={18} /> Tambah
                </button>
              </form>
            </div>

            <div className="card glass">
              <div className="card-header">
                <h3>Daftar Tamu</h3>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Link Undangan</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                          Belum ada tamu. Tambahkan tamu di atas.
                        </td>
                      </tr>
                    ) : (
                      guests.map((guest, index) => (
                        <tr key={guest.id}>
                          <td><strong>{guest.name}</strong></td>
                          <td>
                            <div className="link-cell">
                              <code className="guest-link">?to={guest.name}</code>
                              <button 
                                className="icon-btn" 
                                onClick={() => copyLink(guest.name, index)}
                                title="Copy WhatsApp Link"
                              >
                                {copiedIndex === index ? <Check size={16} color="#48bb78" /> : <Copy size={16} />}
                              </button>
                            </div>
                          </td>
                          <td>
                            <button 
                              className="icon-btn delete-btn" 
                              onClick={() => deleteGuest(guest.id)}
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            <div className="card glass">
              <div className="card-header">
                <h3>Respon RSVP</h3>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Kehadiran</th>
                      <th>Pesan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                          Belum ada pesan masuk.
                        </td>
                      </tr>
                    ) : (
                      rsvps.map((rsvp, index) => (
                        <tr key={index}>
                          <td><strong>{rsvp.name}</strong></td>
                          <td>
                            <span className={`status-tag ${rsvp.attendance.toLowerCase().replace(' ', '-')}`}>
                              {rsvp.attendance}
                            </span>
                          </td>
                          <td className="message-cell">{rsvp.message}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .admin-container {
          display: flex;
          min-height: 100vh;
          background: #f7fafc;
          font-family: var(--font-body);
        }
        .sidebar {
          width: 280px;
          background: var(--secondary);
          color: white;
          padding: 30px;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
        }
        .sidebar-header { margin-bottom: 50px; }
        .sidebar-header h2 { font-family: var(--font-heading); color: var(--primary-light); }
        .sidebar-header p { font-size: 0.8rem; opacity: 0.7; }
        .sidebar-divider {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 20px 0 10px 15px;
          opacity: 0.5;
        }
        nav { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        nav button {
          background: transparent;
          border: none;
          color: white;
          padding: 12px 15px;
          text-align: left;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        nav button:hover, nav button.active { background: rgba(255,255,255,0.1); color: var(--primary-light); }
        .logout-btn {
          margin-top: auto;
          background: rgba(255,255,255,0.05);
          border: none;
          color: #fc8181;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .main-content { margin-left: 280px; flex: 1; padding: 40px; }
        .main-header { margin-bottom: 40px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .stat-card { padding: 25px; border-radius: 20px; text-align: center; }
        .stat-card span { font-size: 0.8rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px; }
        .stat-card h3 { font-size: 2rem; color: var(--secondary); margin-top: 5px; }
        .header-top { display: flex; flex-direction: column; gap: 20px; }
        .back-link {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--primary);
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          width: fit-content;
        }
        .wedding-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .wedding-card {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .wedding-card h3 { color: var(--secondary); margin: 0; }
        .wedding-stats { display: flex; gap: 15px; font-size: 0.85rem; color: var(--text-light); }
        .wedding-actions { display: flex; gap: 10px; border-top: 1px solid #f7fafc; pt: 15px; margin-top: 5px;}
        .btn-secondary {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--primary);
          background: white;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
        }
        .btn-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f7fafc;
          color: var(--text-light);
        }
        .empty-state { text-align: center; padding: 60px !important; }
        .hint { font-size: 0.85rem; opacity: 0.6; margin-top: 10px; }
        .card { background: white; border-radius: 20px; padding: 30px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.05); }
        .card-header { margin-bottom: 25px; }
        .card-header h3 { color: var(--secondary); font-size: 1.2rem; }
        .add-guest-form { display: flex; gap: 15px; }
        .add-guest-form input {
          flex: 1;
          padding: 12px 20px;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          outline: none;
        }
        .table-responsive { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 15px; border-bottom: 2px solid #f7fafc; color: var(--text-light); font-weight: 600; font-size: 0.85rem; }
        td { padding: 15px; border-bottom: 1px solid #f7fafc; color: var(--text-dark); font-size: 0.9rem; }
        .link-cell { display: flex; align-items: center; gap: 10px; }
        .guest-link { background: #f7fafc; padding: 5px 10px; border-radius: 5px; color: var(--primary); font-size: 0.8rem; font-family: monospace; }
        .icon-btn {
          background: #f7fafc;
          border: none;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .icon-btn:hover { background: #edf2f7; transform: scale(1.1); }
        .delete-btn { color: #e53e3e; }
        .status-tag { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .status-tag.hadir { background: #c6f6d5; color: #22543d; }
        .status-tag.tidak-hadir { background: #fed7d7; color: #822727; }
        .status-tag.masih-ragu { background: #feebc8; color: #7b341e; }
        .message-cell { font-style: italic; opacity: 0.8; }
        @media (max-width: 1024px) {
          .sidebar { width: 80px; padding: 20px 10px; }
          .sidebar-header h2, .sidebar-header p, nav button span { display: none; }
          .main-content { margin-left: 80px; padding: 20px; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

export default AdminPage
