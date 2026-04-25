'use client'
import { useState } from 'react'

const localCommittees = [
  'Oran',
  'Constantine',
  'Batna',
  'Sidi Bel Abbes',
  'Bejaia',
  'Tlemcen',
  'Babez',
  'Benak',
  'Blida',
]

const roles = ['LCVP', 'LCP', 'TL', 'Member', 'Alumni', 'EST']

const fields = [
  { key: 'fullName', label: 'Full Name', placeholder: 'Your full name', type: 'text' },
  { key: 'email', label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
  { key: 'phone', label: 'Phone Number', placeholder: '+213 XXX XXX XXX', type: 'tel' },
] as const

const featureNotes = ['9 local committees', 'QR pass at check-in', 'Fast jungle gate access']

type ReservationResponse = {
  id: string
  qrCodeDataUrl: string
}

export default function SeatPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    lc: '',
    role: '',
    diet: 'none',
    allergies: '',
    roommate: '',
  })
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [reservationId, setReservationId] = useState('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const nextErrors: Record<string, string> = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Required'
    if (!form.email.trim() || !form.email.includes('@')) nextErrors.email = 'Valid email required'
    if (!form.phone.trim()) nextErrors.phone = 'Required'
    if (!form.lc) nextErrors.lc = 'Select your LC'
    if (!form.role) nextErrors.role = 'Select your role'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('Reservation failed')
      }

      const data: ReservationResponse = await res.json()
      setReservationId(data.id)
      setQrCodeDataUrl(data.qrCodeDataUrl)
      setSuccess(true)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const logoTextStyle: React.CSSProperties = {
    fontFamily: 'Cinzel, Georgia, serif',
    fontSize: 'clamp(54px, 11vw, 94px)',
    lineHeight: 0.88,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    color: '#ffd42d',
    WebkitTextStroke: '8px #6a3416',
    paintOrder: 'stroke fill',
    textShadow: '0 10px 0 #8d4a1d, 0 18px 28px rgba(77, 37, 16, 0.35)',
  }

  const boardStyle: React.CSSProperties = {
    background:
      'radial-gradient(circle at top, rgba(255,255,255,0.45), transparent 26%), linear-gradient(180deg, #f8edd6 0%, #ead8b1 100%)',
    border: '6px solid #6b3d1c',
    boxShadow: 'inset 0 0 0 3px #9f6c37, 0 22px 40px rgba(61, 33, 14, 0.24)',
    borderRadius: '28px',
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: '100vh',
          paddingTop: '88px',
          paddingBottom: '60px',
          background:
            'radial-gradient(circle at top center, rgba(255,240,194,0.36), transparent 20%), linear-gradient(180deg, #efe4c8 0%, #dcc59a 100%)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div
            className="animate-in"
            style={{
              ...boardStyle,
              padding: '42px 28px 34px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: '18px', border: '2px dashed rgba(107,61,28,0.18)', borderRadius: '20px', pointerEvents: 'none' }} />
            <div style={{ fontSize: '38px', marginBottom: '12px' }}>🌿</div>
            <h1 style={{ ...logoTextStyle, fontSize: 'clamp(34px, 7vw, 60px)', WebkitTextStroke: '5px #6a3416', marginBottom: '12px' }}>
              Jumanco
            </h1>
            <p style={{ color: '#5d452f', fontSize: '18px', lineHeight: '1.75', maxWidth: '560px', margin: '0 auto 24px' }}>
              Welcome, <strong>{form.fullName}</strong>. Your camp registration is complete and your gate pass is ready.
            </p>

            <div
              style={{
                maxWidth: '620px',
                margin: '0 auto 24px',
                background: 'rgba(255,255,255,0.32)',
                border: '3px solid rgba(107,61,28,0.22)',
                borderRadius: '22px',
                padding: '20px',
              }}
            >
              <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px', fontWeight: 700 }}>
                Expedition ID
              </p>
              <p style={{ fontFamily: 'DM Mono, monospace', color: '#432711', fontSize: '20px', marginBottom: '18px' }}>{reservationId}</p>
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Reservation QR code"
                  style={{
                    width: '220px',
                    height: '220px',
                    display: 'block',
                    margin: '0 auto 16px',
                    background: '#fffdfa',
                    padding: '14px',
                    borderRadius: '18px',
                    border: '4px solid #7b5528',
                  }}
                />
              ) : null}
              <p style={{ color: '#5d452f', fontSize: '14px', lineHeight: '1.7' }}>
                Keep this QR code for check-in. You can also use your expedition ID at the registration desk.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="/profile"
                style={{
                  padding: '13px 24px',
                  borderRadius: '999px',
                  background: 'linear-gradient(180deg, #ffd72f, #e7a81d)',
                  color: '#49240f',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '3px solid #6a3416',
                  boxShadow: '0 8px 0 #8c521c',
                }}
              >
                Open Profile
              </a>
              <a
                href="/location#schedule"
                style={{
                  padding: '13px 24px',
                  borderRadius: '999px',
                  background: '#fff6df',
                  color: '#5a3516',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '3px solid #6a3416',
                }}
              >
                View Schedule
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '88px',
        paddingBottom: '64px',
        background:
          'radial-gradient(circle at top center, rgba(255,240,194,0.38), transparent 20%), linear-gradient(180deg, #f2e8cf 0%, #dec898 100%)',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.92fr) minmax(380px, 1.08fr)',
            gap: '26px',
            alignItems: 'start',
          }}
          className="hero-grid"
        >
          <div className="animate-in" style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
              {featureNotes.map((note) => (
                <span
                  key={note}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.45)',
                    border: '2px solid rgba(107,61,28,0.16)',
                    color: '#6f4a28',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {note}
                </span>
              ))}
            </div>

            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
              <div style={{ ...logoTextStyle }}>
                Juma
                <br />
                nco
              </div>
              <div style={{ position: 'absolute', top: '-10px', left: '-26px', fontSize: '34px', transform: 'rotate(-18deg)' }}>🍃</div>
              <div style={{ position: 'absolute', top: '44px', right: '-18px', fontSize: '26px', transform: 'rotate(16deg)' }}>🌿</div>
              <div style={{ position: 'absolute', bottom: '-2px', left: '56%', fontSize: '28px', transform: 'rotate(12deg)' }}>🍃</div>
            </div>

            <p style={{ color: '#7b5528', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px', fontSize: '12px' }}>
              Camp Registration
            </p>
            <h1 style={{ color: '#4f2f17', fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1.02, marginBottom: '16px', fontFamily: 'Cinzel, Georgia, serif' }}>
              Enter The Board And Claim Your Spot
            </h1>
            <p style={{ color: '#5f4930', fontSize: '17px', lineHeight: 1.8, maxWidth: '520px', marginBottom: '22px' }}>
              A bright jungle-board style registration inspired by your reference. Pick your committee, add your camp details, and generate your QR pass for the conference gate.
            </p>

            <div
              style={{
                ...boardStyle,
                padding: '20px 22px',
                maxWidth: '520px',
                background: 'linear-gradient(180deg, #f6e9ca 0%, #e7d2a2 100%)',
              }}
            >
              <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '12px', fontWeight: 700 }}>
                Adventure Flow
              </p>
              {[
                'Fill in your core delegate information.',
                'Add health and roommate notes.',
                'Generate your QR pass for the event entrance.',
              ].map((item, index) => (
                <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: index < 2 ? '12px' : '0' }}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#ffd72f',
                      color: '#542f13',
                      border: '3px solid #6a3416',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <p style={{ color: '#53361e', lineHeight: 1.6, paddingTop: '3px' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="animate-in"
            style={{
              ...boardStyle,
              padding: '28px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: '16px', border: '2px dashed rgba(107,61,28,0.18)', borderRadius: '20px', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '14px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '8px', fontWeight: 700 }}>
                  Registration Board
                </p>
                <h2 style={{ color: '#4d2d16', fontSize: '30px', fontFamily: 'Cinzel, Georgia, serif' }}>
                  {step === 1 ? 'Explorer Info' : 'Camp Details'}
                </h2>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: step >= s ? '#ffd72f' : 'rgba(107,61,28,0.08)',
                      border: '3px solid #6a3416',
                      color: '#532d13',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {step === 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {fields.map((field) => (
                  <div key={field.key}>
                    <label style={{ display: 'block', color: '#644325', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      style={{
                        background: 'rgba(255,249,236,0.85)',
                        color: '#51301a',
                        border: `3px solid ${errors[field.key] ? '#c45128' : '#9f6c37'}`,
                        borderRadius: '18px',
                      }}
                    />
                    {errors[field.key] ? <p style={{ color: '#b23e23', fontSize: '12px', marginTop: '6px', fontWeight: 700 }}>{errors[field.key]}</p> : null}
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', color: '#644325', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Local Committee
                  </label>
                  <select
                    value={form.lc}
                    onChange={(event) => setForm((prev) => ({ ...prev, lc: event.target.value }))}
                    style={{
                      background: 'rgba(255,249,236,0.85)',
                      color: '#51301a',
                      border: `3px solid ${errors.lc ? '#c45128' : '#9f6c37'}`,
                      borderRadius: '18px',
                    }}
                  >
                    <option value="">Select your LC</option>
                    {localCommittees.map((lc) => (
                      <option key={lc} value={lc}>
                        {lc}
                      </option>
                    ))}
                  </select>
                  {errors.lc ? <p style={{ color: '#b23e23', fontSize: '12px', marginTop: '6px', fontWeight: 700 }}>{errors.lc}</p> : null}
                </div>

                <div>
                  <label style={{ display: 'block', color: '#644325', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    style={{
                      background: 'rgba(255,249,236,0.85)',
                      color: '#51301a',
                      border: `3px solid ${errors.role ? '#c45128' : '#9f6c37'}`,
                      borderRadius: '18px',
                    }}
                  >
                    <option value="">Select your role</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role ? <p style={{ color: '#b23e23', fontSize: '12px', marginTop: '6px', fontWeight: 700 }}>{errors.role}</p> : null}
                </div>

                <button
                  onClick={() => {
                    if (validate()) setStep(2)
                  }}
                  style={{
                    marginTop: '6px',
                    padding: '15px',
                    borderRadius: '999px',
                    background: 'linear-gradient(180deg, #ffd72f, #e7a81d)',
                    color: '#4c250f',
                    border: '3px solid #6a3416',
                    boxShadow: '0 8px 0 #8c521c',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Continue
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', color: '#644325', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Dietary Requirements
                  </label>
                  <select
                    value={form.diet}
                    onChange={(event) => setForm((prev) => ({ ...prev, diet: event.target.value }))}
                    style={{
                      background: 'rgba(255,249,236,0.85)',
                      color: '#51301a',
                      border: '3px solid #9f6c37',
                      borderRadius: '18px',
                    }}
                  >
                    <option value="none">No restrictions</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="halal">Halal only</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#644325', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Allergy Issue
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write any allergy or medical concern the team should know about."
                    value={form.allergies}
                    onChange={(event) => setForm((prev) => ({ ...prev, allergies: event.target.value }))}
                    style={{
                      resize: 'vertical',
                      background: 'rgba(255,249,236,0.85)',
                      color: '#51301a',
                      border: '3px solid #9f6c37',
                      borderRadius: '18px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#644325', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Preferred Roommate
                  </label>
                  <input
                    type="text"
                    placeholder="Full name of your preferred roommate"
                    value={form.roommate}
                    onChange={(event) => setForm((prev) => ({ ...prev, roommate: event.target.value }))}
                    style={{
                      background: 'rgba(255,249,236,0.85)',
                      color: '#51301a',
                      border: '3px solid #9f6c37',
                      borderRadius: '18px',
                    }}
                  />
                </div>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.34)',
                    border: '3px solid rgba(107,61,28,0.18)',
                    borderRadius: '20px',
                    padding: '16px',
                  }}
                >
                  <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px', fontWeight: 700 }}>
                    Registration Summary
                  </p>
                  {[
                    ['Name', form.fullName],
                    ['LC', form.lc],
                    ['Role', form.role],
                    ['Email', form.email],
                    ['Allergies', form.allergies || 'None noted'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#6a5035', fontSize: '13px' }}>{label}</span>
                      <span style={{ color: '#49311b', fontWeight: 700, fontSize: '13px', textAlign: 'right' }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      padding: '15px',
                      borderRadius: '999px',
                      background: '#fff6df',
                      color: '#5a3516',
                      border: '3px solid #6a3416',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      flex: 2,
                      minWidth: '220px',
                      padding: '15px',
                      borderRadius: '999px',
                      background: submitting ? '#dbc387' : 'linear-gradient(180deg, #ffd72f, #e7a81d)',
                      color: '#4c250f',
                      border: '3px solid #6a3416',
                      boxShadow: submitting ? 'none' : '0 8px 0 #8c521c',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {submitting ? 'Registering...' : 'Generate QR Pass'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
