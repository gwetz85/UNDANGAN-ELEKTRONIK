import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(targetDate) - +new Date()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const countdownItems = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ]

  return (
    <section className="section countdown-section">
      <motion.h2 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="countdown-title"
      >
        Save The Date
      </motion.h2>
      <div className="countdown-grid">
        {countdownItems.map((item, index) => (
          <motion.div 
            key={item.label}
            className="countdown-item glass"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="value">{item.value.toString().padStart(2, '0')}</span>
            <span className="label">{item.label}</span>
          </motion.div>
        ))}
      </div>

      <style>{`
        .countdown-section {
          background-color: var(--white);
          position: relative;
        }
        .countdown-title {
          margin-bottom: 50px;
          font-size: 2.5rem;
          color: var(--secondary);
        }
        .countdown-grid {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .countdown-item {
          width: 100px;
          height: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          background: rgba(184, 134, 11, 0.05);
        }
        .value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary);
          font-family: var(--font-heading);
        }
        .label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-light);
        }
        @media (max-width: 600px) {
          .countdown-item {
            width: 80px;
            height: 80px;
          }
          .value { font-size: 1.4rem; }
        }
      `}</style>
    </section>
  )
}

export default Countdown
