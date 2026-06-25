const SHEET_NAME = 'Reservations2'
const CHECKINS_SHEET_NAME = 'CheckIns'
const SPREADSHEET_ID = '1FVYNibMYUt08VwtCQp2iyewDoSVX47ZCOF2DjD7dY_g'
const PICTURES_FOLDER_ID = '1qbUc3qTVJOoeoCTS-7TVJSmZnSzTOsBi'

function authorizeSetup() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const folder = DriveApp.getFolderById(PICTURES_FOLDER_ID)
  const testFile = folder.createFile(Utilities.newBlob('authorization test', 'text/plain', 'juman-co-authorization-test.txt'))
  testFile.setTrashed(true)
  return {
    spreadsheetName: spreadsheet.getName(),
    folderName: folder.getName(),
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)

    if (data.action === 'checkin') {
      return handleCheckin(data)
    }

    if (data.action === 'uploadAssets') {
      return handleUploadAssets(data)
    }

    const sheet = getReservationsSheet()
    const pictureResult = savePicture(data)
    const qrResult = saveQrPass(data)

    sheet.appendRow([
      new Date(),                                       // col 1:  Received At
      data.id || '',                                    // col 2:  Reservation ID
      data.privacyCertified ? 'Yes' : 'No',            // col 3:  Privacy Certified
      data.fullName || '',                              // col 4:  Full Name
      data.wellbeing || '',                             // col 5:  Holding Up Lately
      data.age || '',                                   // col 6:  Age
      data.phone || '',                                 // col 7:  WhatsApp Phone
      data.facebookLink || '',                          // col 8:  Facebook Link
      data.funFact || '',                               // col 9:  Fun Fact
      data.pictureName || '',                           // col 10: Picture Name
      pictureResult.url || pictureResult.error || '',   // col 11: Picture Drive Link
      data.lc || '',                                    // col 12: LC
      data.department || '',                            // col 13: Department
      data.position || '',                              // col 14: Current Position
      data.excitement || '',                            // col 15: Excitement Rating
      data.attendedNationalConference || '',            // col 16: Attended National Conference
      data.differently || '',                           // col 17: Done Differently
      data.expectations || '',                          // col 18: Adventure Expectations
      data.allergies || '',                             // col 19: Food Allergies
      data.comfort || '',                               // col 20: Comfort Notes
      data.comingFor || '',                             // col 21: Coming For
      data.feeAgreement ? 'Yes' : 'No',                // col 22: Fee Agreement
      data.createdAt || '',                             // col 23: Created At
      qrResult.url || qrResult.error || '',             // col 24: QR Pass Drive Link
      '',                                               // col 25: Goodie T-shirt (removed)
      '',                                               // col 26: Goodie T-shirt Size (removed)
      '',                                               // col 27: Goodie Pack (removed)
      data.email || '',                                 // col 28: Email
      data.goodiesTotal || '0',                         // col 29: Goodies Total
      '',                                               // col 30: Goodie Pin (removed)
      '',                                               // col 31: Goodie Pin Quantity (removed)
      data.goodieWristband || 'No',                     // col 32: Goodie Bracelet
      data.goodieWristbandQuantity || '',               // col 33: Goodie Bracelet Quantity
      '',                                               // col 34: Goodie Cap (removed)
      '',                                               // col 35: Goodie Cap Quantity (removed)
    ])

    return jsonResponse({
      success: true,
      pictureUploaded: Boolean(pictureResult.url),
      pictureError: pictureResult.error || '',
      qrPassUploaded: Boolean(qrResult.url),
      qrPassError: qrResult.error || '',
    })
  } catch (error) {
    return jsonResponse({ success: false, error: String(error && error.message ? error.message : error) })
  }
}

function handleUploadAssets(data) {
  try {
    const pictureResult = savePicture(data)
    const qrResult = saveQrPass(data)

    if (data.id) {
      const sheet = getReservationsSheet()
      const values = sheet.getDataRange().getValues()
      for (let i = values.length - 1; i >= 1; i--) {
        if (String(values[i][1]).trim() === String(data.id).trim()) {
          if (pictureResult.url) sheet.getRange(i + 1, 11).setValue(pictureResult.url)
          if (qrResult.url) sheet.getRange(i + 1, 24).setValue(qrResult.url)
          break
        }
      }
    }

    return jsonResponse({
      success: true,
      pictureUploaded: Boolean(pictureResult.url),
      pictureError: pictureResult.error || '',
      qrPassUploaded: Boolean(qrResult.url),
      qrPassError: qrResult.error || '',
    })
  } catch (error) {
    return jsonResponse({ success: false, error: String(error && error.message ? error.message : error) })
  }
}

function handleCheckin(data) {
  try {
    const sheet = getCheckInsSheet()
    sheet.appendRow([
      new Date(),
      data.delegateId || '',
      data.delegateName || '',
      data.eventId || '',
      data.eventName || '',
      data.organizer || '',
      data.checkedInAt || new Date().toISOString(),
    ])
    return jsonResponse({ success: true })
  } catch (error) {
    return jsonResponse({ success: false, error: String(error && error.message ? error.message : error) })
  }
}

function doGet(e) {
  const params = (e && e.parameter) ? e.parameter : {}

  if (params.action === 'lookup') {
    return handleLookup(params.id, params.event)
  }

  if (params.action === 'stats') {
    try {
      return jsonResponse(getRegistrationStats())
    } catch (error) {
      return jsonResponse({ success: false, error: String(error && error.message ? error.message : error) })
    }
  }

  const status = {
    success: true,
    message: 'JumanCO Google Sheets webhook is connected.',
    sheetName: '',
    folderName: '',
    effectiveUser: '',
    activeUser: '',
    driveWritable: false,
    driveError: '',
  }

  try { status.effectiveUser = Session.getEffectiveUser().getEmail() } catch (e) { status.effectiveUser = '' }
  try { status.activeUser = Session.getActiveUser().getEmail() } catch (e) { status.activeUser = '' }

  try {
    const sheet = getReservationsSheet()
    status.sheetName = sheet.getName()
  } catch (error) {
    status.success = false
    status.message = 'Google Sheets access failed.'
    status.driveError = String(error && error.message ? error.message : error)
    return jsonResponse(status)
  }

  try {
    const folder = getPicturesFolder()
    status.folderName = folder.getName()
    status.driveWritable = testDriveWrite(folder)
  } catch (error) {
    status.message = 'Google Sheets is connected, but Drive picture uploads are not authorized.'
    status.driveError = String(error && error.message ? error.message : error)
  }

  return jsonResponse(status)
}

function handleLookup(delegateId, eventId) {
  try {
    if (!delegateId) {
      return jsonResponse({ found: false, error: 'Missing id' })
    }

    const resSheet = getReservationsSheet()
    const resData = resSheet.getDataRange().getValues()
    const idCol = 1

    let delegateRow = null
    for (let i = 1; i < resData.length; i++) {
      if (String(resData[i][idCol]).trim() === String(delegateId).trim()) {
        delegateRow = resData[i]
        break
      }
    }

    if (!delegateRow) {
      return jsonResponse({ found: false })
    }

    const delegate = {
      id: delegateRow[1],           // col 2:  Reservation ID
      fullName: delegateRow[3],     // col 4:  Full Name
      lc: delegateRow[11],          // col 12: LC
      department: delegateRow[12],  // col 13: Department
      position: delegateRow[13],    // col 14: Current Position
      phone: delegateRow[6],        // col 7:  WhatsApp Phone
      email: delegateRow[27],       // col 28: Email
      pictureUrl: delegateRow[10],  // col 11: Picture Drive Link
      allergies: delegateRow[18],   // col 19: Food Allergies
      comingFor: delegateRow[20],   // col 21: Coming For
    }

    let alreadyCheckedIn = false
    if (eventId) {
      const ciSheet = getCheckInsSheet()
      const ciData = ciSheet.getDataRange().getValues()
      for (let i = 1; i < ciData.length; i++) {
        if (
          String(ciData[i][1]).trim() === String(delegateId).trim() &&
          String(ciData[i][3]).trim() === String(eventId).trim()
        ) {
          alreadyCheckedIn = true
          break
        }
      }
    }

    return jsonResponse({ found: true, delegate, alreadyCheckedIn })
  } catch (error) {
    return jsonResponse({ found: false, error: String(error && error.message ? error.message : error) })
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
}

function getReservationsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME)
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Received At', 'Reservation ID', 'Privacy Certified', 'Full Name',
      'Holding Up Lately', 'Age', 'WhatsApp Phone', 'Facebook Link', 'Fun Fact',
      'Picture Name', 'Picture Drive Link', 'LC', 'Department', 'Current Position',
      'Excitement Rating', 'Attended National Conference', 'Done Differently',
      'Adventure Expectations', 'Food Allergies', 'Comfort Notes', 'Coming For',
      'Fee Agreement', 'Created At', 'QR Pass Drive Link',
      'Goodie T-shirt', 'Goodie T-shirt Size', 'Goodie Pack',
      'Email', 'Goodies Total',
      'Goodie Pin', 'Goodie Pin Quantity',
      'Goodie Bracelet', 'Goodie Bracelet Quantity',
      'Goodie Cap', 'Goodie Cap Quantity',
    ])
  }

  return sheet
}

function savePicture(data) {
  if (!data.pictureDataUrl || !data.pictureName) {
    return { url: '', error: '' }
  }

  const parts = data.pictureDataUrl.split(',')
  if (parts.length < 2) {
    return { url: '', error: 'Invalid picture data.' }
  }

  try {
    const contentType = data.pictureType || 'image/jpeg'
    const bytes = Utilities.base64Decode(parts[1])
    const folder = getPicturesFolder()
    const safeName = String(data.pictureName).replace(/[\\/:*?"<>|]/g, '-')
    const file = folder.createFile(Utilities.newBlob(bytes, contentType, data.id + '-' + safeName))
    return { url: file.getUrl(), error: '' }
  } catch (error) {
    return { url: '', error: 'Drive upload failed: ' + String(error && error.message ? error.message : error) }
  }
}

function saveQrPass(data) {
  if (!data.qrCodeDataUrl || !data.id) {
    return { url: '', error: '' }
  }

  const parts = data.qrCodeDataUrl.split(',')
  if (parts.length < 2) {
    return { url: '', error: 'Invalid QR code data.' }
  }

  try {
    const bytes = Utilities.base64Decode(parts[1])
    const folder = getPicturesFolder()
    const file = folder.createFile(Utilities.newBlob(bytes, 'image/png', data.id + '-qr-pass.png'))
    return { url: file.getUrl(), error: '' }
  } catch (error) {
    return { url: '', error: 'QR pass upload failed: ' + String(error && error.message ? error.message : error) }
  }
}

function getPicturesFolder() {
  return DriveApp.getFolderById(PICTURES_FOLDER_ID)
}

function testDriveWrite(folder) {
  const testFile = folder.createFile(Utilities.newBlob('write test', 'text/plain', 'juman-co-write-test.txt'))
  testFile.setTrashed(true)
  return true
}

function getRegistrationStats() {
  const localCommittees = ['LC Babez', 'LC Benak', 'LC Bejaia', 'LC Blida', 'LC Constantine', 'LC Tlemcen', 'LC Oran']
  const counts = {}
  const sheet = getReservationsSheet()
  const values = sheet.getDataRange().getValues()

  localCommittees.forEach(function (lc) { counts[lc] = 0 })

  const rows = values.slice(1).filter(function (row) {
    return row[1] || row[3] || row[11]
  })

  rows.forEach(function (row) {
    const lc = String(row[11] || '').trim()
    if (lc) counts[lc] = (counts[lc] || 0) + 1
  })

  const ranked = localCommittees
    .map(function (lc, order) { return { lc, order, count: counts[lc] || 0 } })
    .sort(function (a, b) { return b.count - a.count || a.order - b.order })

  const highestCount = Math.max.apply(null, [1].concat(ranked.map(function (i) { return i.count })))

  return {
    success: true,
    source: 'google-sheets',
    totalDelegates: rows.length,
    lcLeaderboard: ranked.map(function (item, index) {
      return {
        lc: item.lc,
        order: item.order,
        count: item.count,
        rank: index + 1,
        progress: item.count === 0 ? 0 : Math.max(10, Math.round((item.count / highestCount) * 100)),
      }
    }),
    updatedAt: new Date().toISOString(),
  }
}

function getCheckInsSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  let sheet = spreadsheet.getSheetByName(CHECKINS_SHEET_NAME)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CHECKINS_SHEET_NAME)
    sheet.appendRow(['Recorded At', 'Delegate ID', 'Delegate Name', 'Event ID', 'Event Name', 'Organizer', 'Checked In At'])
  }

  return sheet
}
