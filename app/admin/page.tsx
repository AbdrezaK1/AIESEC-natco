'use client'
import { useEffect, useState } from 'react'

interface Reservation {
  id: string
  fullName: string
  email: string
  phone: string
  lc: string
  role: string
  diet: string
  allergies: string
  roommate: string
  qrCodeDataUrl: string
  createdAt: string
}

const lcColors = ['#e7a81d', '#c45128', '#7ea24f', '#4f7a4a', '#d6a662', '#95ba54']

export default function AdminPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterLC, setFilterLC] = useState('All')
  const [activeTab, setActiveTab] = useState<'reservations' | 'stats'>('reservations')

  useEffect(() => {
    fetch('/api/reserve')
      .then((response) => response.json())
      .then((data) => {
        setReservations(data)
        setLoading(false)
      })
  }, [])

  const lcs = ['All', ...Array.from(new Set(reservations.map((reservation) => reservation.lc))).sort()]

  const filtered = reservations.filter((reservation) => {
    const searchValue = search.toLowerCase()
    const matchSearch =
      reservation.fullName.toLowerCase().includes(searchValue) ||
      reservation.email.toLowerCase().includes(searchValue) ||
      reservation.lc.toLowerCase().includes(searchValue)
    const matchLC = filterLC === 'All' || reservation.lc === filterLC
    return matchSearch && matchLC
  })

  const byLC = reservations.reduce((accumulator, reservation) => {
    accumulator[reservation.lc] = (accumulator[reservation.lc] || 0) + 1
    return accumulator
  }, {} as Record<string, number>)
  const topLCs = Object.entries(byLC).sort((a, b) => b[1] - a[1]).slice(0, 9)
  const byRole = reservations.reduce((accumulator, reservation) => {
    accumulator[reservation.role] = (accumulator[reservation.role] || 0) + 1
    return accumulator
  }, {} as Record<string, number>)
  const byDiet = reservations.reduce((accumulator, reservation) => {
    const key = reservation.diet === 'none' ? 'standard' : reservation.diet
    accumulator[key] = (accumulator[key] || 0) + 1
    return accumulator
  }, {} as Record<string, number>)
  const allergyCount = reservations.filter((reservation) => reservation.allergies.trim()).length
  const halalCount = reservations.filter((reservation) => reservation.diet === 'halal').length
  const maxLC = Math.max(...Object.values(byLC), 1)

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'LC', 'Role', 'Diet', 'Allergies', 'Roommate', 'Date']
    const rows = reservations.map((reservation) => [
      reservation.id,
      reservation.fullName,
      reservation.email,
      reservation.phone,
      reservation.lc,
      reservation.role,
      reservation.diet,
      reservation.allergies,
      reservation.roommate,
      reservation.createdAt,
    ])
    const csv = [headers, ...rows].map((row) => row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'jumanco-reservations.csv'
    link.click()
  }

  return (
    <div className="paper-page">
      <div className="paper-container">
        <div className="animate-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div>
            <p className="section-kicker" style={{ marginBottom: '10px' }}>
              Admin Board
            </p>
            <h1 className="board-title" style={{ fontSize: 'clamp(34px, 5vw, 54px)' }}>
              Registration Dashboard
            </h1>
          </div>
          <button onClick={exportCSV} className="wood-button">
            Export CSV
          </button>
        </div>

        <div className="board-grid animate-in" style={{ marginBottom: '22px' }}>
          {[
            { label: 'Total Delegates', value: reservations.length, color: '#6a3416' },
            { label: 'Local Committees', value: Object.keys(byLC).length, color: '#4f7a4a' },
            { label: 'Allergy Notes', value: allergyCount, color: '#c45128' },
            { label: 'Halal Requests', value: halalCount, color: '#7ea24f' },
          ].map((card) => (
            <div key={card.label} className="board-panel" style={{ padding: '22px' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: '30px', fontWeight: 700, color: card.color, marginBottom: '6px' }}>{card.value}</p>
                <p className="section-kicker">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {(['reservations', 'stats'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="board-chip"
              style={{
                background: activeTab === tab ? 'rgba(255, 212, 45, 0.45)' : 'rgba(255,255,255,0.4)',
                border: activeTab === tab ? '3px solid #6a3416' : '2px solid rgba(107, 61, 28, 0.12)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'reservations' ? (
          <>
            <div className="board-panel animate-in" style={{ padding: '22px', marginBottom: '18px' }}>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <input placeholder="Search by name, email, or LC..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ maxWidth: '340px' }} />
                <select value={filterLC} onChange={(event) => setFilterLC(event.target.value)} style={{ maxWidth: '220px' }}>
                  {lcs.map((lc) => (
                    <option key={lc} value={lc}>
                      {lc}
                    </option>
                  ))}
                </select>
                <span style={{ color: '#7a6244', fontSize: '13px' }}>
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="board-panel animate-in" style={{ padding: '18px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#7b5b36' }}>Loading registrations...</div>
                ) : filtered.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#7b5b36' }}>No registrations found.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid rgba(107, 61, 28, 0.12)' }}>
                          {['ID', 'Name', 'LC', 'Role', 'Diet', 'Allergies', 'Roommate', 'Date'].map((heading) => (
                            <th
                              key={heading}
                              style={{
                                padding: '12px 14px',
                                textAlign: 'left',
                                color: '#7a5c33',
                                fontWeight: 700,
                                fontSize: '11px',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((reservation, index) => (
                          <tr key={reservation.id} style={{ borderBottom: index < filtered.length - 1 ? '1px solid rgba(107, 61, 28, 0.1)' : 'none' }}>
                            <td style={{ padding: '12px 14px', fontFamily: 'DM Mono, monospace', color: '#6a3416', whiteSpace: 'nowrap' }}>{reservation.id}</td>
                            <td style={{ padding: '12px 14px', color: '#4d2d16', fontWeight: 700, whiteSpace: 'nowrap' }}>{reservation.fullName}</td>
                            <td style={{ padding: '12px 14px', color: '#6a5035', whiteSpace: 'nowrap' }}>{reservation.lc}</td>
                            <td style={{ padding: '12px 14px', color: '#6a5035', whiteSpace: 'nowrap' }}>{reservation.role}</td>
                            <td style={{ padding: '12px 14px', color: '#6a5035', whiteSpace: 'nowrap' }}>{reservation.diet === 'none' ? 'Standard' : reservation.diet}</td>
                            <td style={{ padding: '12px 14px', color: '#6a5035', minWidth: '180px' }}>{reservation.allergies || 'None noted'}</td>
                            <td style={{ padding: '12px 14px', color: '#6a5035', whiteSpace: 'nowrap' }}>{reservation.roommate || '-'}</td>
                            <td style={{ padding: '12px 14px', color: '#8a6f51', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
                              {new Date(reservation.createdAt).toLocaleDateString('en-GB')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'grid', gap: '18px' }} className="animate-in">
            <div className="board-panel" style={{ padding: '24px' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p className="section-kicker" style={{ marginBottom: '10px' }}>
                  Registrations By LC
                </p>
                {topLCs.map(([lc, count], index) => (
                  <div key={lc} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#4d2d16', fontSize: '14px', fontWeight: 700 }}>{lc}</span>
                      <span style={{ color: '#6a5035', fontFamily: 'DM Mono, monospace', fontSize: '13px' }}>{count}</span>
                    </div>
                    <div style={{ height: '10px', borderRadius: '999px', background: 'rgba(107, 61, 28, 0.08)' }}>
                      <div
                        style={{
                          height: '100%',
                          borderRadius: '999px',
                          width: `${(count / maxLC) * 100}%`,
                          background: lcColors[index % lcColors.length],
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="board-grid">
              {[
                { title: 'By Role', data: byRole },
                { title: 'Dietary Needs', data: byDiet },
              ].map(({ title, data }) => (
                <div key={title} className="board-panel" style={{ padding: '24px' }}>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <p className="section-kicker" style={{ marginBottom: '10px' }}>
                      {title}
                    </p>
                    {Object.entries(data)
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, value], index) => (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '12px',
                            padding: '10px 0',
                            borderBottom: index < Object.entries(data).length - 1 ? '1px solid rgba(107, 61, 28, 0.1)' : 'none',
                          }}
                        >
                          <span style={{ color: '#6a5035', textTransform: 'capitalize', fontSize: '14px' }}>{key}</span>
                          <span style={{ color: '#4d2d16', fontWeight: 700, fontFamily: 'DM Mono, monospace', fontSize: '14px' }}>{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
