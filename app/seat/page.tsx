'use client'
import { ChangeEvent, useState } from 'react'

const localCommittees = ['LC Babez', 'LC Benak', 'LC Bejaia', 'LC Blida', 'LC Constantine', 'LC Tlemen', 'LC Oran']
const departments = ['MX', 'BD', 'MKT', 'FL', 'OGX', 'PM&IGV']
const positions = ['Member (newbie)', 'Member (oldie)', 'MM', 'LCVP', 'LCP', 'Alumni']
const ratingOptions = Array.from({ length: 10 }, (_, index) => String(index + 1))

type FormState = {
  privacyCertified: boolean
  fullName: string
  wellbeing: string
  age: string
  phone: string
  facebookLink: string
  funFact: string
  email: string
  pictureName: string
  pictureType: string
  pictureDataUrl: string
  lc: string
  department: string
  position: string
  excitement: string
  attendedNationalConference: string
  differently: string
  expectations: string
  allergies: string
  comfort: string
  comingFor: string
  feeAgreement: boolean
}

type ReservationResponse = {
  id: string
  qrCodeDataUrl: string
  sheetsSynced?: boolean
  sheetsError?: string
}

const initialForm: FormState = {
  privacyCertified: false,
  fullName: '',
  wellbeing: '',
  age: '',
  phone: '',
  facebookLink: '',
  funFact: '',
  email: '',
  pictureName: '',
  pictureType: '',
  pictureDataUrl: '',
  lc: '',
  department: '',
  position: '',
  excitement: '',
  attendedNationalConference: '',
  differently: '',
  expectations: '',
  allergies: '',
  comfort: '',
  comingFor: '',
  feeAgreement: false,
}

const sectionTitles = [
  'Privacy Policy',
  'State Your Name, Player',
  'Your AIESEC Identity',
  'Adventure Readiness',
  'Real Talk',
]

const featureNotes: string[] = []

export default function SeatPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [reservationId, setReservationId] = useState('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [sheetsSynced, setSheetsSynced] = useState(true)
  const [sheetsError, setSheetsError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handlePictureChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      updateField('pictureName', '')
      updateField('pictureType', '')
      updateField('pictureDataUrl', '')
      setErrors((prev) => ({ ...prev, pictureDataUrl: 'Please upload an image file.' }))
      return
    }

    try {
      const dataUrl = await resizeImage(file)
      updateField('pictureName', file.name)
      updateField('pictureType', 'image/jpeg')
      updateField('pictureDataUrl', dataUrl)
    } catch {
      updateField('pictureName', '')
      updateField('pictureType', '')
      updateField('pictureDataUrl', '')
      setErrors((prev) => ({ ...prev, pictureDataUrl: 'Unable to prepare this image. Please try another one.' }))
    }
  }

  const resizeImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const image = new Image()
      const reader = new FileReader()

      reader.onload = () => {
        image.src = String(reader.result)
      }
      reader.onerror = () => reject(new Error('Unable to read image'))

      image.onload = () => {
        const maxSize = 900
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)

        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error('Canvas is not available'))
          return
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.78))
      }
      image.onerror = () => reject(new Error('Unable to load image'))

      reader.readAsDataURL(file)
    })

  const validateStep = (targetStep = step) => {
    const nextErrors: Record<string, string> = {}

    if (targetStep === 1 && !form.privacyCertified) {
      nextErrors.privacyCertified = 'You must certify this before continuing.'
    }

    if (targetStep === 2) {
      if (!form.fullName.trim()) nextErrors.fullName = 'Required'
      if (!form.wellbeing.trim()) nextErrors.wellbeing = 'Required'
      if (!form.age.trim()) nextErrors.age = 'Required'
      if (!form.phone.trim()) nextErrors.phone = 'Required'
      if (!form.email.trim() || !form.email.includes('@')) nextErrors.email = 'Valid email required'
      if (!form.facebookLink.trim()) nextErrors.facebookLink = 'Required'
      if (!form.funFact.trim()) nextErrors.funFact = 'Required'
      if (!form.pictureDataUrl) nextErrors.pictureDataUrl = 'Please add a smiling picture.'
    }

    if (targetStep === 3) {
      if (!form.lc) nextErrors.lc = 'Select your LC'
      if (!form.department) nextErrors.department = 'Select your department'
      if (!form.position) nextErrors.position = 'Select your current position'
    }

    if (targetStep === 4) {
      if (!form.excitement) nextErrors.excitement = 'Choose a rating'
      if (!form.attendedNationalConference) nextErrors.attendedNationalConference = 'Choose yes or no'
      if (!form.expectations.trim()) nextErrors.expectations = 'Required'
    }

    if (targetStep === 5) {
      if (!form.comingFor) nextErrors.comingFor = 'Choose your journey'
      if (!form.feeAgreement) nextErrors.feeAgreement = 'You must agree before submitting.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 5))
      setSubmitError('')
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return
    setSubmitError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.error || 'Registration failed')
      }

      const data: ReservationResponse = await res.json()
      setReservationId(data.id)
      setQrCodeDataUrl(data.qrCodeDataUrl)
      setSheetsSynced(data.sheetsSynced !== false)
      setSheetsError(data.sheetsError || '')
      setSuccess(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = (key?: keyof FormState): React.CSSProperties => ({
    background: 'rgba(255,249,236,0.9)',
    color: '#51301a',
    border: `3px solid ${key && errors[key] ? '#c45128' : '#9f6c37'}`,
    borderRadius: '18px',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#644325',
    fontSize: '13px',
    fontWeight: 700,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  const boardStyle: React.CSSProperties = {
    background:
      'radial-gradient(circle at top, rgba(255,255,255,0.45), transparent 26%), linear-gradient(180deg, #f8edd6 0%, #ead8b1 100%)',
    border: '6px solid var(--brand-bark)',
    boxShadow: 'inset 0 0 0 3px #9f6c37, 0 22px 40px rgba(61, 33, 14, 0.24)',
    borderRadius: '28px',
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

  const errorText = (key: keyof FormState) =>
    errors[key] ? <p style={{ color: '#b23e23', fontSize: '12px', marginTop: '6px', fontWeight: 700 }}>{errors[key]}</p> : null

  const qrDownloadName = reservationId ? `${reservationId}-qr-pass.png` : 'jumanco-qr-pass.png'

  const renderTextInput = (
    key: keyof FormState,
    label: string,
    placeholder: string,
    type = 'text',
  ) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={String(form[key])}
        onChange={(event) => updateField(key, event.target.value as never)}
        style={inputStyle(key)}
      />
      {errorText(key)}
    </div>
  )

  const renderTextarea = (key: keyof FormState, label: string, placeholder: string, rows = 3) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={String(form[key])}
        onChange={(event) => updateField(key, event.target.value as never)}
        style={{ ...inputStyle(key), resize: 'vertical' }}
      />
      {errorText(key)}
    </div>
  )

  const renderSelect = (key: keyof FormState, label: string, placeholder: string, options: string[]) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <select value={String(form[key])} onChange={(event) => updateField(key, event.target.value as never)} style={inputStyle(key)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errorText(key)}
    </div>
  )

  if (success) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '88px', paddingBottom: '60px', background: 'linear-gradient(180deg, #efe4c8 0%, #dcc59a 100%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-in" style={{ ...boardStyle, padding: '42px 28px 34px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: '18px', border: '2px dashed rgba(107,61,28,0.18)', borderRadius: '20px', pointerEvents: 'none' }} />
            <div style={{ fontSize: '38px', marginBottom: '12px' }}>Checkpoint</div>
            <h1 style={{ ...logoTextStyle, fontSize: 'clamp(34px, 7vw, 60px)', WebkitTextStroke: '5px #6a3416', marginBottom: '12px' }}>
              You made it
            </h1>
            <p style={{ color: '#5d452f', fontSize: '18px', lineHeight: '1.75', maxWidth: '620px', margin: '0 auto 24px' }}>
              You made it through the first checkpoint, congrats! You've entered the game... Thank you for registering for Juman'CO.
              Download your QR pass now and keep it ready for check-in.
            </p>
            <div
              role="status"
              style={{
                maxWidth: '640px',
                margin: '0 auto 22px',
                background: 'linear-gradient(180deg, rgba(255, 215, 47, 0.34), rgba(231, 168, 29, 0.24))',
                border: '4px solid #6a3416',
                borderRadius: '20px',
                boxShadow: '0 10px 0 rgba(140, 82, 28, 0.42), inset 0 0 0 2px rgba(255, 249, 236, 0.7)',
                color: '#4c250f',
                padding: '18px 20px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: '20px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
                Important Check-In Step
              </p>
              <p style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.6 }}>
                Download your QR pass before leaving this page. You will need it to enter the conference.
              </p>
            </div>
            {!sheetsSynced ? (
              <div
                role="alert"
                style={{
                  maxWidth: '620px',
                  margin: '0 auto 22px',
                  background: 'rgba(196, 81, 40, 0.12)',
                  border: '3px solid rgba(196, 81, 40, 0.35)',
                  borderRadius: '18px',
                  color: '#783018',
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: 1.6,
                  padding: '14px 16px',
                }}
              >
                Registration saved locally, but Google Sheets did not receive it. {sheetsError || 'Check Apps Script permissions, deploy a new web app version, then restart the site.'}
              </div>
            ) : null}

            <div style={{ maxWidth: '720px', margin: '0 auto 24px', background: 'rgba(255,255,255,0.32)', border: '3px solid rgba(107,61,28,0.22)', borderRadius: '22px', padding: '22px' }}>
              <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(220px, 0.8fr)', gap: '18px', alignItems: 'stretch' }}>
                <div style={{ background: 'linear-gradient(180deg, rgba(255,247,227,0.9), rgba(244,225,179,0.88))', border: '4px solid #6a3416', borderRadius: '20px', padding: '20px', textAlign: 'left' }}>
                  <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '10px', fontWeight: 700 }}>
                    Player Pass
                  </p>
                  <p style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#4d2d16', fontSize: '30px', lineHeight: 1.05, marginBottom: '12px' }}>
                    {form.fullName}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    {[form.lc, form.department, form.position].map((item) => (
                      <span key={item} style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(255, 212, 45, 0.36)', border: '2px solid rgba(106,52,22,0.16)', color: '#6a3416', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                    {[
                      ['Reservation ID', reservationId],
                      ['Adventure', form.comingFor],
                      ['Excitement', `${form.excitement}/10`],
                      ['Allergies', form.allergies || 'None noted'],
                    ].map(([label, value]) => (
                      <div key={label} style={{ background: 'rgba(255,255,255,0.42)', border: '2px solid rgba(106,52,22,0.12)', borderRadius: '16px', padding: '12px' }}>
                        <p style={{ color: '#8a6538', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '5px', fontWeight: 700 }}>{label}</p>
                        <p style={{ color: '#432711', fontSize: '13px', fontWeight: 700, lineHeight: 1.5, wordBreak: 'break-word' }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 251, 242, 0.86)', border: '4px solid #7b5528', borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                  <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px', fontWeight: 700 }}>
                    Check-In QR
                  </p>
                  {qrCodeDataUrl ? (
                    <>
                      <img src={qrCodeDataUrl} alt="Reservation QR code" style={{ width: '220px', height: '220px', display: 'block', margin: '0 auto 14px', background: '#fffdfa', padding: '14px', borderRadius: '18px', border: '4px solid #7b5528', maxWidth: '100%' }} />
                      <a
                        href={qrCodeDataUrl}
                        download={qrDownloadName}
                        aria-label={`Download QR pass for reservation ${reservationId}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          maxWidth: '240px',
                          margin: '0 auto 12px',
                          padding: '12px 16px',
                          borderRadius: '999px',
                          background: 'linear-gradient(180deg, #ffd72f, #e7a81d)',
                          border: '3px solid #6a3416',
                          boxShadow: '0 6px 0 #8c521c',
                          color: '#4c250f',
                          fontSize: '13px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textDecoration: 'none',
                          textTransform: 'uppercase',
                        }}
                      >
                        Download QR Pass
                      </a>
                    </>
                  ) : null}
                  <p style={{ color: '#5d452f', fontSize: '13px', lineHeight: '1.7' }}>
                    Keep this pass safe. It is required for check-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '88px', paddingBottom: '64px', background: 'radial-gradient(circle at top center, rgba(255,240,194,0.38), transparent 20%), linear-gradient(180deg, #f2e8cf 0%, #dec898 100%)' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.86fr) minmax(420px, 1.14fr)', gap: '26px', alignItems: 'start' }}>
          <div className="animate-in" style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
              {featureNotes.map((note) => (
                <span key={note} style={{ padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.45)', border: '2px solid rgba(107,61,28,0.16)', color: '#6f4a28', fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {note}
                </span>
              ))}
            </div>

            <div className="official-logo-shell hero-official-logo">
              <img className="official-logo-image" src="/jumanco-logo.png" alt="Juman'CO official conference logo" />
            </div>

            <p style={{ color: '#7b5528', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px', fontSize: '12px' }}>
              Game Registration
            </p>
            <h1 style={{ color: '#4f2f17', fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1.02, marginBottom: '16px', fontFamily: 'Cinzel, Georgia, serif' }}>
              Enter The Game And Secure Your Spot
            </h1>
            <p style={{ color: '#5f4930', fontSize: '17px', lineHeight: 1.8, maxWidth: '520px', marginBottom: '22px' }}>
              Move through each checkpoint, tell us who you are, choose your journey, and submit your Juman'CO application.
            </p>

            <div style={{ ...boardStyle, padding: '20px 22px', maxWidth: '520px', background: 'linear-gradient(180deg, #f6e9ca 0%, #e7d2a2 100%)' }}>
              <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '12px', fontWeight: 700 }}>
                Adventure Flow
              </p>
              {sectionTitles.map((title, index) => (
                <button
                  key={title}
                  onClick={() => setStep(index + 1)}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    width: '100%',
                    padding: '10px 0',
                    border: 0,
                    background: 'transparent',
                    textAlign: 'left',
                    color: '#53361e',
                  }}
                >
                  <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= index + 1 ? '#ffd72f' : 'rgba(107,61,28,0.08)', color: '#542f13', border: '3px solid #6a3416', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: step === index + 1 ? 700 : 500 }}>{title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="animate-in" style={{ ...boardStyle, padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: '16px', border: '2px dashed rgba(107,61,28,0.18)', borderRadius: '20px', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '14px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '8px', fontWeight: 700 }}>
                    Section {step} of 5
                  </p>
                  <h2 style={{ color: '#4d2d16', fontSize: '30px', fontFamily: 'Cinzel, Georgia, serif' }}>
                    {sectionTitles[step - 1]}
                  </h2>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} style={{ width: '34px', height: '34px', borderRadius: '50%', background: step >= s ? '#ffd72f' : 'rgba(107,61,28,0.08)', border: '3px solid #6a3416', color: '#532d13', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {step === 1 ? (
                  <>
                    <div style={{ background: 'rgba(255,255,255,0.34)', border: '3px solid rgba(107,61,28,0.18)', borderRadius: '20px', padding: '18px' }}>
                      <p style={{ color: '#53361e', fontSize: '16px', lineHeight: 1.7, marginBottom: '12px' }}>
                        Check our general privacy policy here:{' '}
                        <a href="https://bit.ly/4wV42NV" target="_blank" rel="noreferrer" style={{ color: '#6a3416', fontWeight: 700 }}>
                          bit.ly/4wV42NV
                        </a>
                      </p>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#4d2d16', fontWeight: 700, lineHeight: 1.5 }}>
                        <input
                          type="checkbox"
                          checked={form.privacyCertified}
                          onChange={(event) => updateField('privacyCertified', event.target.checked)}
                          style={{ width: '20px', height: '20px', marginTop: '2px', flexShrink: 0 }}
                        />
                        I certify that I am 18 years old and of lawful age.
                      </label>
                      {errorText('privacyCertified')}
                    </div>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    {renderTextInput('fullName', 'State your name, player.', 'Your full name')}
                    {renderTextarea('wellbeing', 'How have you been holding up lately?', 'Tell us how you are arriving to this adventure.')}
                    <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
                      {renderTextInput('age', 'Your age', '18', 'number')}
                      {renderTextInput('phone', 'Phone Number (WhatsApp)', '+213 XXX XXX XXX', 'tel')}
                    </div>
                    {renderTextInput('email', 'Email Address', 'you@example.com', 'email')}
                    {renderTextInput('facebookLink', 'Facebook Link', 'https://facebook.com/your.profile', 'url')}
                    {renderTextarea('funFact', "Every player has a hidden trait... What's a fun fact about you?", 'Drop the lore here.')}
                    <div>
                      <label style={labelStyle}>A picture of you smiling :)</label>
                      <input type="file" accept="image/*" onChange={handlePictureChange} style={inputStyle('pictureDataUrl')} />
                      {form.pictureName ? <p style={{ color: '#4f7a4a', fontSize: '12px', marginTop: '6px', fontWeight: 700 }}>{form.pictureName} selected</p> : null}
                      {errorText('pictureDataUrl')}
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    {renderSelect('lc', 'Your LC', 'Select your LC', localCommittees)}
                    {renderSelect('department', 'Your Department', 'Select your department', departments)}
                    {renderSelect('position', 'Your current position', 'Select your current position', positions)}
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    {renderSelect('excitement', 'How excited are you to be part of this unique adventure?', 'Rate from 1 to 10', ratingOptions)}
                    {renderSelect('attendedNationalConference', 'Have you ever attended a National Conference?', 'Choose one', ['Yes', 'No (good start with this one ;) )'])}
                    {form.attendedNationalConference === 'Yes' ? renderTextarea('differently', 'If yes, what would you like to see done differently in this experience?', 'Tell us what should feel different this time.') : null}
                    {renderTextarea('expectations', 'What do you expect from this adventure?', 'Share your expectations.')}
                    {renderTextarea('allergies', 'Before we continue the adventure, do you have any food allergies?', 'Write any allergy or medical concern.')}
                    {renderTextarea('comfort', 'Anything that would help you feel more comfortable during the adventure?', 'Let us know what would help.')}
                  </>
                ) : null}

                {step === 5 ? (
                  <>
                    <div style={{ background: 'rgba(255,255,255,0.34)', border: '3px solid rgba(107,61,28,0.18)', borderRadius: '20px', padding: '18px' }}>
                      <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px', fontWeight: 700 }}>
                        Real Talk - it's time to secure your spot.
                      </p>
                      <p style={{ color: '#53361e', lineHeight: 1.8 }}>
                        The game is starting... Ra7 t9le3 l'avion, be quick and hop in!
                      </p>
                      <p style={{ color: '#53361e', lineHeight: 1.8, marginTop: '10px' }}>
                        Choose your journey: 3 days / 2 nights - meals + accommodation included - .... DA. 1 night only - .... DA.
                      </p>
                    </div>
                    {renderSelect('comingFor', 'You are coming for', 'Choose your journey', ['1 night', '2 nights'])}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#4d2d16', fontWeight: 700, lineHeight: 1.5 }}>
                      <input
                        type="checkbox"
                        checked={form.feeAgreement}
                        onChange={(event) => updateField('feeAgreement', event.target.checked)}
                        style={{ width: '20px', height: '20px', marginTop: '2px', flexShrink: 0 }}
                      />
                      By submitting this form, I agree that I am going to pay .... DA as fees for this conference attendance, even if I will not be present.
                    </label>
                    {errorText('feeAgreement')}
                  </>
                ) : null}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '6px' }}>
                  <button
                    onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
                    disabled={step === 1 || submitting}
                    style={{ flex: 1, minWidth: '150px', padding: '15px', borderRadius: '999px', background: '#fff6df', color: '#5a3516', border: '3px solid #6a3416', fontSize: '14px', fontWeight: 700, cursor: step === 1 || submitting ? 'not-allowed' : 'pointer', opacity: step === 1 ? 0.55 : 1, textTransform: 'uppercase' }}
                  >
                    Back
                  </button>
                  {step < 5 ? (
                    <button
                      onClick={goNext}
                      style={{ flex: 2, minWidth: '220px', padding: '15px', borderRadius: '999px', background: 'linear-gradient(180deg, #ffd72f, #e7a81d)', color: '#4c250f', border: '3px solid #6a3416', boxShadow: '0 8px 0 #8c521c', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      style={{ flex: 2, minWidth: '220px', padding: '15px', borderRadius: '999px', background: submitting ? '#dbc387' : 'linear-gradient(180deg, #ffd72f, #e7a81d)', color: '#4c250f', border: '3px solid #6a3416', boxShadow: submitting ? 'none' : '0 8px 0 #8c521c', fontSize: '14px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                </div>

                {submitError ? (
                  <div role="alert" style={{ background: 'rgba(196, 81, 40, 0.12)', border: '3px solid rgba(196, 81, 40, 0.35)', borderRadius: '18px', color: '#783018', fontSize: '14px', fontWeight: 700, lineHeight: 1.6, padding: '14px 16px' }}>
                    {submitError}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
