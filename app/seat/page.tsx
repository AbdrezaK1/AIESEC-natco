'use client'
import { ChangeEvent, useState } from 'react'

const REGISTRATION_OPEN = false

const localCommittees = ['LC Babez', 'LC Benak', 'LC Bejaia', 'LC Blida', 'LC Constantine', 'LC Tlemcen', 'LC Oran','OE Batna','OE Sidi Bel abbes']
const departments = ['MX', 'BD', 'MKT', 'FL', 'OGX', 'PM&IGV']
const positions = ['Member (newbie)', 'Member (oldie)', 'MM', 'LCVP', 'LCP', 'EST', 'Alumni']
const ratingOptions = Array.from({ length: 10 }, (_, index) => String(index + 1))
const goodieChoiceOptions = ['No', 'Yes']
const braceletPrice = 150


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
  goodieWristband: string
  goodieWristbandQuantity: string
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
  goodieWristband: 'No',
  goodieWristbandQuantity: '',
  feeAgreement: false,
}

const sectionTitles = [
  'Privacy Policy',
  'Your AIESEC Identity',
  'State Your Name, Player',
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

  const updateFields = (values: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...values }))
    setErrors((prev) => {
      const next = { ...prev }
      Object.keys(values).forEach((key) => {
        delete next[key]
      })
      return next
    })
  }

  const hasValidQuantity = (value: string) => {
    const quantity = Number(value)
    return Number.isInteger(quantity) && quantity > 0
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
      if (!form.lc) nextErrors.lc = 'Select your LC'
      if (!form.position) nextErrors.position = 'Select your current position'
      if (form.position !== 'LCP' && form.position !== 'Alumni' && !form.department) nextErrors.department = 'Select your department'
    }

    if (targetStep === 3) {
      if (!form.fullName.trim()) {
        nextErrors.fullName = 'Required'
      } else if (!/^[a-zA-ZÀ-ÿ؀-ۿ\s'-]+$/.test(form.fullName.trim())) {
        nextErrors.fullName = 'Letters only'
      }
      if (!form.wellbeing.trim()) {
        nextErrors.wellbeing = 'Required'
      } else if (!/^[a-zA-ZÀ-ÿ؀-ۿ\s.,!?'"()-]+$/.test(form.wellbeing.trim())) {
        nextErrors.wellbeing = 'Letters only'
      }
      if (!form.age.trim()) {
        nextErrors.age = 'Required'
      } else if (!/^\d+$/.test(form.age.trim())) {
        nextErrors.age = 'Numbers only'
      }
      const phoneDigits = form.phone.replace(/^\+213/, '')
      if (!phoneDigits) {
        nextErrors.phone = 'Required'
      } else if (!/^\d{9}$/.test(phoneDigits)) {
        nextErrors.phone = 'Enter 9 digits after +213'
      }
      if (!form.email.trim()) {
        nextErrors.email = 'Required'
      } else if (form.position !== 'Alumni' && !form.email.trim().endsWith('@aiesec.net')) {
        nextErrors.email = 'Must be an @aiesec.net email'
      }
      if (!form.facebookLink.trim()) {
        nextErrors.facebookLink = 'Required'
      } else if (!form.facebookLink.includes('facebook.com') && !form.facebookLink.includes('fb.com')) {
        nextErrors.facebookLink = 'Enter a valid Facebook profile link (facebook.com)'
      }
      if (!form.funFact.trim()) nextErrors.funFact = 'Required'
      if (!form.pictureDataUrl) nextErrors.pictureDataUrl = 'Please add a smiling picture.'
    }

    if (targetStep === 4) {
      if (!form.excitement) nextErrors.excitement = 'Choose a rating'
      if (!form.attendedNationalConference) nextErrors.attendedNationalConference = 'Choose yes or no'
      if (!form.expectations.trim()) nextErrors.expectations = 'Required'
    }

    if (targetStep === 5) {
      if (!form.comingFor) nextErrors.comingFor = 'Choose your journey'
      if (form.goodieWristband === 'Yes' && !hasValidQuantity(form.goodieWristbandQuantity)) nextErrors.goodieWristbandQuantity = 'Choose the number of bracelets'
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

  const seatPageBackground = 'var(--site-jungle-background)'

  const boardStyle: React.CSSProperties = {
    background:
      'radial-gradient(circle at top, rgba(255,255,255,0.42), transparent 28%), radial-gradient(circle at 96% 0%, rgba(143, 206, 97, 0.14), transparent 24%), linear-gradient(180deg, var(--quest-parchment, #fff4d1) 0%, #ead39a 100%)',
    border: '6px solid var(--quest-board-bark, #4c230f)',
    boxShadow: 'inset 0 0 0 3px rgba(255, 232, 128, 0.36), 0 24px 44px rgba(44, 24, 10, 0.24)',
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

  
if (!REGISTRATION_OPEN) {
  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '88px',
        paddingBottom: '64px',
        background: 'var(--site-jungle-background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '620px',
          width: '100%',
          margin: '0 24px',
          background:
            'radial-gradient(circle at top, rgba(255,255,255,0.42), transparent 28%), linear-gradient(180deg, var(--quest-parchment, #fff4d1) 0%, #ead39a 100%)',
          border: '6px solid #4c230f',
          boxShadow:
            'inset 0 0 0 3px rgba(255, 232, 128, 0.36), 0 24px 44px rgba(44, 24, 10, 0.24)',
          borderRadius: '28px',
          padding: '48px 36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '16px',
            border: '2px dashed rgba(107,61,28,0.18)',
            borderRadius: '20px',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏕️</div>

          <p
            style={{
              color: '#7b5528',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            Registration Status
          </p>

          <h1
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              color: '#4d2d16',
              fontSize: 'clamp(28px, 6vw, 44px)',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Registrations Are Officially Closed
          </h1>

          <p
            style={{
              color: '#5f4930',
              fontSize: '17px',
              lineHeight: 1.8,
              marginBottom: '28px',
            }}
          >
            The gates of JumanCo have now closed. All available spots have been
            filled, and registrations for this edition are officially over.
            Thank you to everyone who answered the call of the adventure.
          </p>

          <div
            style={{
              background: 'rgba(255,212,45,0.22)',
              border: '3px solid rgba(106,52,22,0.2)',
              borderRadius: '18px',
              padding: '16px 20px',
              marginBottom: '28px',
            }}
          >
            <p
              style={{
                color: '#6a3416',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: 1.6,
              }}
            >
              Registered participants: your spot is confirmed. Please check your
              email regularly confirmation, important information, and the
              next steps of your journey.
            </p>
          </div>

          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '14px 32px',
              borderRadius: '999px',
              background: 'linear-gradient(180deg, #ffd72f, #e7a81d)',
              border: '3px solid #6a3416',
              boxShadow: '0 6px 0 #8c521c',
              color: '#4c250f',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Return to Camp
          </a>
        </div>
      </div>
    </div>
  )
}



  const isAlumni = form.position === 'Alumni'
  const conferenceFee = !form.comingFor ? 0
    : form.comingFor === '1 night' ? 3500
    : isAlumni ? 7000 : 6400

  const qrDownloadName = reservationId ? `${reservationId}-qr-pass.png` : 'jumanco-qr-pass.png'
  const goodiesTotal = form.goodieWristband === 'Yes' && hasValidQuantity(form.goodieWristbandQuantity)
    ? Number(form.goodieWristbandQuantity) * braceletPrice
    : 0
  const selectedGoodies = [
    form.goodieWristband === 'Yes' ? `Bracelet x${form.goodieWristbandQuantity || '0'} - ${hasValidQuantity(form.goodieWristbandQuantity) ? Number(form.goodieWristbandQuantity) * braceletPrice : 0} DA` : '',
  ].filter(Boolean)
  const goodiesSummary = selectedGoodies.length ? `${selectedGoodies.join(', ')}. Total: ${goodiesTotal} DA` : 'No goodies selected'

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
      <select aria-label={label} value={String(form[key])} onChange={(event) => updateField(key, event.target.value as never)} style={inputStyle(key)}>
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

  const renderQuantityInput = (key: keyof FormState, label: string) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type="number"
        min="1"
        step="1"
        aria-label={label}
        placeholder="1"
        value={String(form[key])}
        onChange={(event) => updateField(key, event.target.value as never)}
        style={inputStyle(key)}
      />
      {errorText(key)}
    </div>
  )

  if (success) {
    return (
      <div className="seat-page-shell" style={{ minHeight: '100vh', paddingTop: '88px', paddingBottom: '60px', background: seatPageBackground }}>
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
                      ['Goodies', goodiesSummary],
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
    <div className="seat-page-shell" style={{ minHeight: '100vh', paddingTop: '88px', paddingBottom: '64px', background: seatPageBackground }}>
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

            <div style={{ ...boardStyle, padding: '20px 22px', maxWidth: '520px' }}>
              <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '12px', fontWeight: 700 }}>
                Adventure Flow
              </p>
              {sectionTitles.map((title, index) => (
                <div
                  key={title}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    width: '100%',
                    padding: '10px 0',
                    color: '#53361e',
                  }}
                >
                  <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= index + 1 ? '#ffd72f' : 'rgba(107,61,28,0.08)', color: '#542f13', border: '3px solid #6a3416', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                    {index + 1}
                  </span>
                  <span style={{ fontWeight: step === index + 1 ? 700 : 500 }}>{title}</span>
                </div>
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
                    {renderSelect('lc', 'Your LC', 'Select your LC', localCommittees)}
                    {renderSelect('position', 'Your current position', 'Select your current position', positions)}
                    {form.position !== 'LCP' && form.position !== 'Alumni' ? renderSelect('department', 'Your Department', 'Select your department', departments) : null}
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <div>
                      <label style={labelStyle}>State your name, player.</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={form.fullName}
                        onChange={(e) => updateField('fullName', e.target.value.replace(/[^a-zA-ZÀ-ÿ؀-ۿ\s'-]/g, ''))}
                        style={inputStyle('fullName')}
                      />
                      {errorText('fullName')}
                    </div>
                    <div>
                      <label style={labelStyle}>How have you been holding up lately?</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us how you are arriving to this adventure."
                        value={form.wellbeing}
                        onChange={(e) => updateField('wellbeing', e.target.value.replace(/[^a-zA-ZÀ-ÿ؀-ۿ\s.,!?'"()-]/g, ''))}
                        style={{ ...inputStyle('wellbeing'), resize: 'vertical' }}
                      />
                      {errorText('wellbeing')}
                    </div>
                    <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
                      <div>
                        <label style={labelStyle}>Your age</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="18"
                          value={form.age}
                          onChange={(e) => updateField('age', e.target.value.replace(/\D/g, ''))}
                          style={inputStyle('age')}
                        />
                        {errorText('age')}
                      </div>
                      <div>
                        <label style={labelStyle}>Phone Number (WhatsApp)</label>
                        <div style={{ display: 'flex', ...inputStyle('phone'), padding: 0, overflow: 'hidden', alignItems: 'stretch' }}>
                          <span style={{ padding: '0 12px', background: 'rgba(159,108,55,0.12)', borderRight: '2px solid #9f6c37', color: '#51301a', fontWeight: 700, display: 'flex', alignItems: 'center', flexShrink: 0, fontSize: '14px' }}>+213</span>
                          <input
                            type="tel"
                            placeholder="XXX XXX XXX"
                            value={form.phone.replace(/^\+213/, '')}
                            onChange={(e) => updateField('phone', '+213' + e.target.value.replace(/\D/g, '').slice(0, 9))}
                            style={{ border: 'none', background: 'transparent', flex: 1, padding: '12px 14px', color: '#51301a', outline: 'none', fontSize: '14px' }}
                          />
                        </div>
                        {errorText('phone')}
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input
                        type="email"
                        placeholder={isAlumni ? 'your@email.com' : 'you@aiesec.net'}
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        style={inputStyle('email')}
                      />
                      {isAlumni ? (
                        <p style={{ color: '#7b5528', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>As an alumni, any email address is accepted.</p>
                      ) : null}
                      {errorText('email')}
                    </div>
                    <div>
                      <label style={labelStyle}>Facebook Link</label>
                      <input
                        type="url"
                        placeholder="https://facebook.com/your.profile"
                        value={form.facebookLink}
                        onChange={(e) => updateField('facebookLink', e.target.value)}
                        style={inputStyle('facebookLink')}
                      />
                      {errorText('facebookLink')}
                    </div>
                    {renderTextarea('funFact', "Every player has a hidden trait... What's a fun fact about you?", 'Drop the lore here.')}
                    <div>
                      <label style={labelStyle}>A picture of you smiling :)</label>
                      <input type="file" accept="image/*" onChange={handlePictureChange} style={inputStyle('pictureDataUrl')} />
                      {form.pictureName ? <p style={{ color: '#4f7a4a', fontSize: '12px', marginTop: '6px', fontWeight: 700 }}>{form.pictureName} selected</p> : null}
                      {errorText('pictureDataUrl')}
                    </div>
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
                        Choose your journey:
                      </p>
                      <ul style={{ color: '#53361e', lineHeight: 2, marginTop: '6px', paddingLeft: '20px' }}>
                        <li>1 night — 3 500 DA</li>
                        <li>2 nights (3 days, meals + accommodation included) — {isAlumni ? '7 000' : '6 400'} DA</li>
                      </ul>
                    </div>
                    {renderSelect('comingFor', 'You are coming for', 'Choose your journey', ['1 night', '2 nights'])}
                    <div style={{ background: 'rgba(255,255,255,0.34)', border: '3px solid rgba(107,61,28,0.18)', borderRadius: '20px', padding: '18px' }}>
                      <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10px', fontWeight: 700 }}>
                        Goodies
                      </p>
                      <p style={{ color: '#53361e', lineHeight: 1.8, marginBottom: '16px' }}>
                        Add a bracelet to your registration.
                      </p>

                      <div className="board-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))' }}>
                        <div className="metric-card" style={{ display: 'grid', gap: '12px' }}>
                          <img src="/goodies/wristband.jpg" alt="JumanCO bracelet" style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: '16px', border: '3px solid rgba(107,61,28,0.18)' }} />
                          <div>
                            <p className="board-title" style={{ fontSize: '20px', marginBottom: '6px' }}>Bracelet</p>
                            <p style={{ color: '#6a5035', fontSize: '13px', lineHeight: 1.6 }}>{braceletPrice} DA each. If you choose it, quantity is required.</p>
                          </div>
                          <div>
                            <label style={labelStyle}>Do you want the bracelet?</label>
                            <select
                              aria-label="Bracelet goodie choice"
                              value={form.goodieWristband}
                              onChange={(event) => updateFields({
                                goodieWristband: event.target.value,
                                goodieWristbandQuantity: event.target.value === 'Yes' ? form.goodieWristbandQuantity : '',
                              })}
                              style={inputStyle('goodieWristband')}
                            >
                              {goodieChoiceOptions.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                          {form.goodieWristband === 'Yes' ? renderQuantityInput('goodieWristbandQuantity', 'Number of bracelets') : null}
                        </div>
                      </div>

                      <div style={{ marginTop: '18px', background: 'rgba(255, 212, 45, 0.28)', border: '3px solid rgba(107,61,28,0.18)', borderRadius: '18px', padding: '14px 16px' }}>
                        <p style={{ color: '#7b5528', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px', fontWeight: 700 }}>
                          Goodies total
                        </p>
                        <p style={{ color: '#4d2d16', fontSize: '22px', fontWeight: 800 }}>{goodiesTotal} DA</p>
                        <p style={{ color: '#6a5035', fontSize: '13px', lineHeight: 1.6, marginTop: '4px' }}>
                          {selectedGoodies.length ? selectedGoodies.join(', ') : 'No goodies selected'}
                        </p>
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#4d2d16', fontWeight: 700, lineHeight: 1.5 }}>
                      <input
                        type="checkbox"
                        checked={form.feeAgreement}
                        onChange={(event) => updateField('feeAgreement', event.target.checked)}
                        style={{ width: '20px', height: '20px', marginTop: '2px', flexShrink: 0 }}
                      />
                      By submitting this form, I agree that I am going to pay {conferenceFee} DA as fees for this conference attendance{goodiesTotal > 0 ? `, and ${goodiesTotal} DA for goodies` : ''}, even if I will not be present.
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
