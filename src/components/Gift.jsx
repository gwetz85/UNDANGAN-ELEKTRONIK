import { motion } from 'framer-motion'
import { Copy, Check, CreditCard, Gift as GiftIcon } from 'lucide-react'
import { useState } from 'react'

const Gift = ({ accounts = [] }) => {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const defaultAccounts = [
    {
      bank: 'Bank BCA',
      number: '1234567890',
      name: 'Romeo Montague',
      icon: <CreditCard size={24} />
    },
    {
      bank: 'Bank Mandiri',
      number: '0987654321',
      name: 'Juliet Capulet',
      icon: <CreditCard size={24} />
    }
  ]

  const handleCopy = (num, index) => {
    navigator.clipboard.writeText(num)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section className="section gift-section">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <GiftIcon className="section-icon" size={32} />
          <h2>Kado Digital</h2>
          <p>Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, pemanfaatannya akan kami gunakan sebaik-baiknya.</p>
        </motion.div>

        <div className="gift-grid">
          {(accounts.length > 0 ? accounts : defaultAccounts).map((acc, index) => (
            <motion.div 
              key={index}
              className="gift-card glass"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="bank-icon">{acc.icon}</div>
              <h3>{acc.bank}</h3>
              <p className="acc-name">{acc.name}</p>
              <div className="acc-number-box">
                <span className="acc-number">{acc.number}</span>
                <button 
                  className="copy-btn"
                  onClick={() => handleCopy(acc.number, index)}
                >
                  {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .gift-section {
          background-color: var(--bg-cream);
        }
        .section-header {
          max-width: 600px;
          margin: 0 auto 50px;
        }
        .section-icon {
          color: var(--primary);
          margin-bottom: 15px;
        }
        .gift-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 800px;
          margin: 0 auto;
        }
        .gift-card {
          padding: 40px;
          border-radius: 20px;
          text-align: center;
        }
        .bank-icon {
          color: var(--primary);
          margin-bottom: 15px;
          display: flex;
          justify-content: center;
        }
        .gift-card h3 {
          font-size: 1.4rem;
          margin-bottom: 10px;
          color: var(--secondary);
        }
        .acc-name {
          font-weight: 500;
          margin-bottom: 20px;
          color: var(--text-dark);
        }
        .acc-number-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          background: rgba(184, 134, 11, 0.1);
          padding: 10px 20px;
          border-radius: 10px;
          margin-top: 10px;
        }
        .acc-number {
          font-family: monospace;
          font-weight: 700;
          color: var(--primary);
          font-size: 1.1rem;
        }
        .copy-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: var(--transition-smooth);
        }
        .copy-btn:hover {
          transform: scale(1.2);
        }
      `}</style>
    </section>
  )
}

export default Gift
