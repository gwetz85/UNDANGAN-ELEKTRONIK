import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, MessageSquare, Plus, Trash2, Copy, Check, LogOut, ExternalLink, ChevronLeft, LayoutDashboard, Settings, Save, X } from 'lucide-react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { db } from '../firebase'
import { ref, push, onValue, remove, set, serverTimestamp, query, orderByChild } from 'firebase/database'

const AdminPage = () => {
  const navigate = useNavigate()
  const { weddingSlug } = useParams()
  const [activeTab, setActiveTab] = useState('guests')
  const [weddings, setWeddings] = useState([])
  const [guests, setGuests] = useState([])
  const [rsvps, setRsvps] = useState([])
  const [newGuestName, setNewGuestName] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  // Settings & Creation State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newWedding, setNewWedding] = useState({ slug: '', coupleNames: '', type: 'wedding' })
  const [config, setConfig] = useState({
    coupleNames: '',
    weddingDate: '',
    musicUrl: '',
    coverImage: '',
    hero: { title: '', description: '', image: '' },
    events: [],
    bankAccounts: [],
    gallery: [],
    template: 'classic',
    fontPairing: 'classic',
    animationStyle: 'fade',
    type: 'wedding'
  })

  useEffect(() => {
    if (!weddingSlug) {
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

    // Fetch Config for specific wedding
    const configRef = ref(db, `weddings/${weddingSlug}/config`)
    const unsubConfig = onValue(configRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setConfig({
          ...config,
          ...data,
          events: data.events || [],
          bankAccounts: data.bankAccounts || [],
          gallery: data.gallery || []
        })
      }
    })

    const guestRef = query(ref(db, `weddings/${weddingSlug}/guests`), orderByChild('createdAt'))
    const unsubGuests = onValue(guestRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setGuests(Object.keys(data).map(key => ({ id: key, ...data[key] })).reverse())
      } else {
        setGuests([])
      }
    })

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
      unsubConfig()
      unsubGuests()
      unsubRsvps()
    }
  }, [weddingSlug])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    navigate('/login')
  }

  const getInitialConfig = (type, coupleNames) => {
    const presets = {
      wedding: {
        hero: { title: 'MAHA SUCI ALLAH', description: 'Atas izin-Mu, kami mengundang Anda untuk merayakan hari bahagia kami.' },
        events: [
          { title: 'Akad Nikah', date: 'Tentukan Tanggal', time: '09:00 - 11:00 WIB', agenda: '', location: 'Lokasi Akad', mapUrl: '#', locationImage: '', mapImage: '' },
          { title: 'Resepsi', date: 'Tentukan Tanggal', time: '12:00 - 16:00 WIB', agenda: '', location: 'Gedung Pertemuan', mapUrl: '#', locationImage: '', mapImage: '' }
        ]
      },
      birthday: {
        hero: { title: 'HAPPY BIRTHDAY', description: 'Terima kasih telah menemani perjalanan hidup saya hingga saat ini.' },
        events: [
          { title: 'Tiup Lilin & Doa', date: 'Tentukan Tanggal', time: '16:00 - 18:00 WIB', agenda: '', location: 'Kediaman', mapUrl: '#', locationImage: '', mapImage: '' },
          { title: 'Makan Bersama', date: 'Tentukan Tanggal', time: '18:00 - Selesai', agenda: '', location: 'Restoran/Kediaman', mapUrl: '#', locationImage: '', mapImage: '' }
        ]
      },
      meeting: {
        hero: { title: 'OFFICIAL MEETING', description: 'Sinergi dan kolaborasi untuk mencapai tujuan bersama.' },
        events: [
          { title: 'Sesi Pembukaan', date: 'Tentukan Tanggal', time: '09:00 - 10:00 WIB', agenda: '', location: 'Ruang Rapat', mapUrl: '#', locationImage: '', mapImage: '' },
          { title: 'Diskusi Utama', date: 'Tentukan Tanggal', time: '10:00 - 12:00 WIB', agenda: '', location: 'Ruang Rapat', mapUrl: '#', locationImage: '', mapImage: '' }
        ]
      },
      event: {
        hero: { title: 'SPECIAL EVENT', description: 'Mari bergabung dan rayakan momen spesial ini bersama kami.' },
        events: [
          { title: 'Acara Utama', date: 'Tentukan Tanggal', time: '19:00 - Selesai', agenda: '', location: 'Venue Utama', mapUrl: '#', locationImage: '', mapImage: '' }
        ]
      }
    }

    const base = presets[type] || presets.wedding
    return {
      coupleNames,
      weddingDate: new Date().toISOString().split('T')[0] + 'T09:00:00',
      hero: base.hero,
      events: base.events,
      notes: '',
      footerText: 'TARUNA BANGSA TANJUNGPINANG TEAM',
      template: 'classic',
      fontPairing: 'classic',
      animationStyle: 'fade',
      type: type,
      musicUrl: '',
      coverImage: '',
      bankAccounts: [],
      gallery: []
    }
  }

  const handleCreateWedding = async (e) => {
    e.preventDefault()
    if (!newWedding.slug || !newWedding.coupleNames) return
    const slug = newWedding.slug.toLowerCase().replace(/\s+/g, '-')
    
    setIsSaving(true)
    try {
      const initialConfig = getInitialConfig(newWedding.type || 'wedding', newWedding.coupleNames)
      await set(ref(db, `weddings/${slug}/config`), initialConfig)
      setShowCreateModal(false)
      setNewWedding({ slug: '', coupleNames: '' })
      navigate(`/admin/${slug}`)
    } catch (error) {
      alert("Gagal membuat undangan: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteWedding = async (slug) => {
    if (window.confirm(`Hapus seluruh data undangan "${slug}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await remove(ref(db, `weddings/${slug}`))
      } catch (error) {
        alert("Gagal menghapus: " + error.message)
      }
    }
  }

  const handleSaveConfig = async () => {
    setIsSaving(true)
    try {
      await set(ref(db, `weddings/${weddingSlug}/config`), config)
      alert("Pengaturan berhasil disimpan!")
    } catch (error) {
      alert("Gagal menyimpan: " + error.message)
    } finally {
      setIsSaving(false)
    }
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

  // Dynamic List Handlers
  const addEvent = () => {
    setConfig({
      ...config,
      events: [...config.events, { title: '', date: '', time: '', agenda: '', location: '', mapUrl: '', locationImage: '', mapImage: '' }]
    })
  }

  const removeEvent = (index) => {
    const newEvents = [...config.events]
    newEvents.splice(index, 1)
    setConfig({ ...config, events: newEvents })
  }

  const updateEvent = (index, field, value) => {
    const newEvents = [...config.events]
    newEvents[index][field] = value
    setConfig({ ...config, events: newEvents })
  }

  const addBankAccount = () => {
    setConfig({
      ...config,
      bankAccounts: [...config.bankAccounts, { bank: '', name: '', number: '' }]
    })
  }

  const removeBankAccount = (index) => {
    const newBanks = [...config.bankAccounts]
    newBanks.splice(index, 1)
    setConfig({ ...config, bankAccounts: newBanks })
  }

  const updateBankAccount = (index, field, value) => {
    const newBanks = [...config.bankAccounts]
    newBanks[index][field] = value
    setConfig({ ...config, bankAccounts: newBanks })
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
            onClick={() => { navigate('/admin'); setActiveTab('guests'); }}
          >
            <LayoutDashboard size={20} /> Semua Undangan
          </button>
          
          {weddingSlug && (
            <>
              <div className="sidebar-divider">Kelola: {weddingSlug}</div>
              <button 
                className={activeTab === 'settings' ? 'active' : ''} 
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={20} /> Pengaturan Undangan
              </button>
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
              <div className="header-nav">
                <button className="back-link" onClick={() => navigate('/admin')}>
                  <ChevronLeft size={20} /> Kembali
                </button>
                <h1>{config.coupleNames || weddingSlug}</h1>
              </div>
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
            <div className="header-flex">
              <h1>Semua Undangan Aktif</h1>
              <button className="btn-premium" onClick={() => setShowCreateModal(true)}>
                <Plus size={18} /> Tambah Undangan
              </button>
            </div>
          )}
        </header>

        {!weddingSlug ? (
          <div className="wedding-list">
            {weddings.length === 0 ? (
              <div className="card glass empty-state">
                <p>Belum ada undangan yang dibuat.</p>
                <button className="btn-secondary" onClick={() => setShowCreateModal(true)}>Buat Undangan Pertama</button>
              </div>
            ) : (
              <div className="wedding-grid">
                {weddings.map(w => (
                  <div key={w.slug} className="card glass wedding-card">
                    <div className="card-top">
                      <h3>{w.coupleNames}</h3>
                      <button className="delete-icon-btn" onClick={() => handleDeleteWedding(w.slug)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="wedding-stats">
                      <span>{w.guestCount} Tamu</span>
                      <span>{w.rsvpCount} RSVP</span>
                    </div>
                    <code className="slug-badge">/{w.slug}</code>
                    <div className="wedding-actions">
                      <button className="btn-secondary" onClick={() => { navigate(`/admin/${w.slug}`); setActiveTab('guests'); }}>
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
          activeTab === 'settings' ? (
            <div className="tab-content">
              <div className="settings-grid">
                {/* General Settings */}
                <div className="card glass">
                  <div className="card-header">
                    <h3>Informasi Umum</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Judul / Nama Acara</label>
                      <input 
                        type="text" 
                        value={config.coupleNames} 
                        onChange={(e) => setConfig({...config, coupleNames: e.target.value})}
                        placeholder="Contoh: Romeo & Juliet / Rapat Divisi"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipe Undangan</label>
                      <select 
                        value={config.type || 'wedding'} 
                        onChange={(e) => setConfig({...config, type: e.target.value})}
                      >
                        <option value="wedding">Pernikahan (Wedding)</option>
                        <option value="birthday">Ulang Tahun (Birthday)</option>
                        <option value="meeting">Rapat (Meeting)</option>
                        <option value="event">Acara Umum (Event)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tanggal Pernikahan</label>
                      <input 
                        type="datetime-local" 
                        value={config.weddingDate} 
                        onChange={(e) => setConfig({...config, weddingDate: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>URL Musik (MP3)</label>
                      <input 
                        type="text" 
                        value={config.musicUrl} 
                        onChange={(e) => setConfig({...config, musicUrl: e.target.value})}
                        placeholder="https://example.com/music.mp3"
                      />
                    </div>
                    <div className="form-group">
                      <label>Cover Image URL</label>
                      <input 
                        type="text" 
                        value={config.coverImage} 
                        onChange={(e) => setConfig({...config, coverImage: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Pilih Template Undangan</label>
                      <select 
                        value={config.template || 'classic'} 
                        onChange={(e) => setConfig({...config, template: e.target.value})}
                        className="template-select"
                      >
                        <option value="classic">Classic Premium</option>
                        <option value="modern">Modern Royal</option>
                        <option value="nature">Nature Forest</option>
                        <option value="romantic">Romantic Pink</option>
                        <option value="vintage">Vintage (Antique)</option>
                        <option value="official">Resmi (Official)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Jenis Huruf (Font)</label>
                      <select 
                        value={config.fontPairing || 'classic'} 
                        onChange={(e) => setConfig({...config, fontPairing: e.target.value})}
                      >
                        <option value="classic">Classic (Serif + Sans)</option>
                        <option value="modern">Modern (Clean Sans)</option>
                        <option value="elegant">Elegant (Display Serif)</option>
                        <option value="romantic">Romantic (Handwritten)</option>
                        <option value="vintage">Vintage (Antique Garamond)</option>
                        <option value="official">Official (Clean Inter)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Gaya Animasi Undangan</label>
                      <select 
                        value={config.animationStyle || 'fade'} 
                        onChange={(e) => setConfig({...config, animationStyle: e.target.value})}
                      >
                        <option value="fade">Standar (Fade In)</option>
                        <option value="slide">Meluncur (Slide Up)</option>
                        <option value="zoom">Zoom (Soft Scale)</option>
                        <option value="elegant">Mewah (Scale & Fade)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Hero Settings */}
                <div className="card glass">
                  <div className="card-header">
                    <h3>Tampilan Hero (Awal)</h3>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Judul Hero</label>
                      <input 
                        type="text" 
                        value={config.hero.title} 
                        onChange={(e) => setConfig({...config, hero: {...config.hero, title: e.target.value}})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Deskripsi Hero</label>
                      <textarea 
                        value={config.hero.description} 
                        onChange={(e) => setConfig({...config, hero: {...config.hero, description: e.target.value}})}
                        rows="2"
                      />
                    </div>
                    <div className="form-group">
                      <label>Gambar Hero URL</label>
                      <input 
                        type="text" 
                        value={config.hero.image} 
                        onChange={(e) => setConfig({...config, hero: {...config.hero, image: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>

                {/* Events Settings */}
                <div className="card glass">
                  <div className="card-header flex-header">
                    <h3>Acara Pernikahan</h3>
                    <button className="btn-icon-text" onClick={addEvent}>
                      <Plus size={16} /> Tambah Acara
                    </button>
                  </div>
                  <div className="dynamic-list">
                    {config.events.map((event, idx) => (
                      <div key={idx} className="dynamic-item glass">
                        <div className="item-header">
                          <h4>Acara #{idx + 1}</h4>
                          <button className="text-danger" onClick={() => removeEvent(idx)}><Trash2 size={16} /></button>
                        </div>
                        <div className="form-grid">
                          <input placeholder="Nama Acara (Akad Nikah)" value={event.title} onChange={(e) => updateEvent(idx, 'title', e.target.value)} />
                          <input placeholder="Tanggal (Minggu, 12 Jan 2026)" value={event.date} onChange={(e) => updateEvent(idx, 'date', e.target.value)} />
                          <input placeholder="Waktu (09:00 - Selesai)" value={event.time} onChange={(e) => updateEvent(idx, 'time', e.target.value)} />
                          <input placeholder="Agenda (Contoh: Doa Bersama)" value={event.agenda} onChange={(e) => updateEvent(idx, 'agenda', e.target.value)} />
                          <input placeholder="Lokasi" value={event.location} onChange={(e) => updateEvent(idx, 'location', e.target.value)} />
                          <input placeholder="Google Maps URL" value={event.mapUrl} onChange={(e) => updateEvent(idx, 'mapUrl', e.target.value)} />
                          <input placeholder="URL Foto Lokasi" value={event.locationImage} onChange={(e) => updateEvent(idx, 'locationImage', e.target.value)} />
                          <input placeholder="URL Foto Peta (Preview)" value={event.mapImage} onChange={(e) => updateEvent(idx, 'mapImage', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gift Settings */}
                <div className="card glass">
                  <div className="card-header flex-header">
                    <h3>Hadiah Digital / Bank</h3>
                    <button className="btn-icon-text" onClick={addBankAccount}>
                      <Plus size={16} /> Tambah Rekening
                    </button>
                  </div>
                  <div className="dynamic-list">
                    {config.bankAccounts.map((acc, idx) => (
                      <div key={idx} className="dynamic-item glass">
                        <div className="item-header">
                          <h4>Rekening #{idx + 1}</h4>
                          <button className="text-danger" onClick={() => removeBankAccount(idx)}><Trash2 size={16} /></button>
                        </div>
                        <div className="form-grid">
                          <input placeholder="Nama Bank" value={acc.bank} onChange={(e) => updateBankAccount(idx, 'bank', e.target.value)} />
                          <input placeholder="Nama Pemilik" value={acc.name} onChange={(e) => updateBankAccount(idx, 'name', e.target.value)} />
                          <input placeholder="Nomor Rekening" value={acc.number} onChange={(e) => updateBankAccount(idx, 'number', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery Settings */}
                <div className="card glass">
                  <div className="card-header">
                    <h3>Galeri Foto (Berjalan/Marquee)</h3>
                  </div>
                  <div className="form-group">
                    <label>URL Foto (Satu URL per baris). Gunakan direct link atau link Google Drive.</label>
                    <textarea 
                      value={config.gallery.join('\n')} 
                      onChange={(e) => setConfig({...config, gallery: e.target.value.split('\n').filter(url => url.trim() !== '')})}
                      placeholder="Contoh: https://drive.google.com/file/d/ID/view"
                      rows="8"
                    />
                    <small style={{ color: '#666', marginTop: '10px', display: 'block' }}>
                      Tip: Untuk Google Drive, pastikan file diset "Anyone with the link can view". 
                      Aplikasi akan otomatis mengubah link menjadi format gambar yang bisa ditampilkan.
                    </small>
                  </div>
                </div>

                {/* Notes Settings */}
                <div className="card glass">
                  <div className="card-header">
                    <h3>Catatan Rapat / Informasi Tambahan</h3>
                  </div>
                  <div className="form-group">
                    <label>Catatan (Satu catatan per baris)</label>
                    <textarea 
                      value={config.notes || ''} 
                      onChange={(e) => setConfig({...config, notes: e.target.value})}
                      placeholder="Masukkan catatan penting di sini..."
                      rows="8"
                    />
                  </div>
                </div>

                {/* Footer Settings */}
                <div className="card glass">
                  <div className="card-header">
                    <h3>Pengaturan Footer / Copyright</h3>
                  </div>
                  <div className="form-group">
                    <label>Teks Copyright (Contoh: Nama Team / Brand)</label>
                    <input 
                      type="text"
                      value={config.footerText || ''} 
                      onChange={(e) => setConfig({...config, footerText: e.target.value})}
                      placeholder="TARUNA BANGSA TANJUNGPINANG TEAM"
                    />
                  </div>
                </div>
              </div>

              <div className="sticky-actions">
                <button className="btn-premium big-btn" onClick={handleSaveConfig} disabled={isSaving}>
                  <Save size={20} /> {isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                </button>
              </div>
            </div>
          ) : activeTab === 'guests' ? (
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
        )
      )}
      </main>

      {/* Create Wedding Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-card glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="modal-header">
                <h3>Buat Undangan Baru</h3>
                <button onClick={() => setShowCreateModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleCreateWedding}>
                <div className="form-group">
                  <label>Slug URL (Contoh: budi-santi)</label>
                  <input 
                    type="text" 
                    placeholder="budi-santi"
                    value={newWedding.slug}
                    onChange={(e) => setNewWedding({...newWedding, slug: e.target.value})}
                    required
                  />
                  <small>Link akan menjadi: <code>your-site.com/{newWedding.slug || 'slug'}</code></small>
                </div>
                <div className="form-group">
                  <label>Judul / Nama Acara</label>
                  <input 
                    type="text" 
                    placeholder="Budi & Santi / Rapat Tahunan"
                    value={newWedding.coupleNames}
                    onChange={(e) => setNewWedding({...newWedding, coupleNames: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipe Undangan</label>
                  <select 
                    value={newWedding.type} 
                    onChange={(e) => setNewWedding({...newWedding, type: e.target.value})}
                    className="modal-select"
                  >
                    <option value="wedding">Pernikahan (Wedding)</option>
                    <option value="birthday">Ulang Tahun (Birthday)</option>
                    <option value="meeting">Rapat (Meeting)</option>
                    <option value="event">Acara Umum (Event)</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Batal</button>
                  <button type="submit" className="btn-premium" disabled={isSaving}>
                    {isSaving ? 'Memproses...' : 'Buat Undangan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          z-index: 100;
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
        nav { flex: 1; display: flex; flex-direction: column; gap: 5px; }
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
        .main-content { margin-left: 280px; flex: 1; padding: 40px; padding-bottom: 100px; }
        .main-header { margin-bottom: 40px; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; }
        .header-nav { display: flex; align-items: center; gap: 20px; }
        .header-nav h1 { font-size: 2rem; color: var(--secondary); margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 25px; }
        .stat-card { padding: 25px; border-radius: 20px; text-align: center; }
        .stat-card span { font-size: 0.8rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 1px; }
        .stat-card h3 { font-size: 2rem; color: var(--secondary); margin-top: 5px; }
        .header-top { display: flex; flex-direction: column; gap: 10px; }
        .back-link {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--primary);
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
        }
        .wedding-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }
        .wedding-card {
          display: flex;
          flex-direction: column;
          gap: 15px;
          position: relative;
        }
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .wedding-card h3 { color: var(--secondary); margin: 0; font-size: 1.3rem; }
        .delete-icon-btn { color: #feb2b2; background: none; border: none; cursor: pointer; padding: 5px; }
        .delete-icon-btn:hover { color: #f56565; }
        .wedding-stats { display: flex; gap: 15px; font-size: 0.85rem; color: var(--text-light); }
        .slug-badge { background: #edf2f7; color: var(--primary); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; width: fit-content; }
        .wedding-actions { display: flex; gap: 10px; border-top: 1px solid #f7fafc; pt: 15px; margin-top: 5px; padding-top: 15px;}
        .btn-secondary {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid var(--primary);
          background: white;
          color: var(--primary);
          font-weight: 600;
          cursor: pointer;
        }
        .btn-icon-text {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-light);
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 8px;
          font-size: 0.85rem;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f7fafc;
          color: var(--text-light);
        }
        .empty-state { text-align: center; padding: 80px !important; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .card { background: white; border-radius: 20px; padding: 30px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01); }
        .card-header { margin-bottom: 25px; }
        .card-header h3 { color: var(--secondary); font-size: 1.25rem; font-family: var(--font-heading); }
        .flex-header { display: flex; justify-content: space-between; align-items: center; }
        
        /* Form Styles */
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text-dark); }
        .form-group input, .form-group textarea, .form-group select {
          padding: 12px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus { border-color: var(--primary); }
        .form-group small { font-size: 0.75rem; color: var(--text-light); }
        
        /* Dynamic List Styles */
        .dynamic-list { display: flex; flex-direction: column; gap: 15px; }
        .dynamic-item { padding: 20px; border-radius: 15px; border: 1px solid #edf2f7; }
        .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .item-header h4 { color: var(--primary); margin: 0; }
        .text-danger { color: #e53e3e; background: none; border: none; cursor: pointer; }
        
        /* Sticky Actions */
        .sticky-actions {
          position: fixed;
          bottom: 30px;
          right: 40px;
          left: 320px;
          display: flex;
          justify-content: flex-end;
          z-index: 90;
        }
        .big-btn { padding: 18px 40px; font-size: 1.1rem; box-shadow: 0 10px 15px -3px rgba(184, 134, 11, 0.3); }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-card { background: white; width: 90%; max-width: 500px; padding: 40px; border-radius: 25px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .modal-header h3 { font-size: 1.5rem; color: var(--secondary); margin: 0; }
        .modal-header button { background: none; border: none; cursor: pointer; color: var(--text-light); }
        .modal-actions { display: flex; gap: 15px; margin-top: 30px; }
        
        .add-guest-form { display: flex; gap: 15px; }
        .add-guest-form input { flex: 1; }
        
        /* Tables */
        .table-responsive { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 15px; border-bottom: 2px solid #f7fafc; color: var(--text-light); font-weight: 600; font-size: 0.85rem; }
        td { padding: 15px; border-bottom: 1px solid #f7fafc; color: var(--text-dark); font-size: 0.9rem; }
        .status-tag { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
        .status-tag.hadir { background: #c6f6d5; color: #22543d; }
        .status-tag.tidak-hadir { background: #fed7d7; color: #822727; }
        .status-tag.masih-ragu { background: #feebc8; color: #7b341e; }
        
        @media (max-width: 1024px) {
          .sidebar { width: 80px; padding: 20px 10px; }
          .sidebar-header h2, .sidebar-header p, nav button span, .sidebar-divider { display: none; }
          .main-content { margin-left: 80px; padding: 20px; }
          .sticky-actions { left: 100px; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

export default AdminPage

