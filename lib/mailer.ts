import nodemailer from 'nodemailer'

type ReservationMailInput = {
  to: string
  fullName: string
  reservationId: string
  qrCodeDataUrl: string
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendReservationEmail(input: ReservationMailInput) {
  const transporter = getTransporter()
  const from = process.env.MAIL_FROM

  if (!transporter || !from) {
    return { sent: false, reason: 'missing-config' as const }
  }

  await transporter.sendMail({
    from,
    to: input.to,
    subject: `Your JUMANCO check-in QR code`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1b1b1b; line-height: 1.6;">
        <h2 style="margin-bottom: 8px;">Welcome to JUMANCO, ${input.fullName}</h2>
        <p>Your registration is confirmed. Please keep this QR code for check-in at the conference.</p>
        <p style="font-weight: 700;">Expedition ID: ${input.reservationId}</p>
        <img src="${input.qrCodeDataUrl}" alt="JUMANCO QR Code" style="width: 220px; height: 220px; display: block; margin: 20px 0;" />
        <p>You can also present this email at the registration desk if needed.</p>
      </div>
    `,
  })

  return { sent: true as const, reason: 'sent' as const }
}
