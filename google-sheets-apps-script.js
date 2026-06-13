const SHEET_NAME = 'Reservations'
const SPREADSHEET_ID = '1FVYNibMYUt08VwtCQp2iyewDoSVX47ZCOF2DjD7dY_g'
const PICTURES_FOLDER_ID = '1qbUc3qTVJOoeoCTS-7TVJSmZnSzTOsBi'

const RESERVATION_HEADERS = [
  'Received At',             // 1
  'Reservation ID',          // 2
  'Privacy Certified',       // 3
  'Full Name',               // 4
  'Holding Up Lately',       // 5
  'Age',                     // 6
  'WhatsApp Phone',          // 7
  'Email',                   // 8
  'Facebook Link',           // 9
  'Fun Fact',                // 10
  'Picture Name',            // 11
  'Picture Drive Link',      // 12
  'LC',                      // 13
  'Department',              // 14
  'Current Position',        // 15
  'Excitement Rating',       // 16
  'Attended National Conference', // 17
  'Done Differently',        // 18
  'Adventure Expectations',  // 19
  'Food Allergies',          // 20
  'Comfort Notes',           // 21
  'Coming For',              // 22
  'Fee Agreement',           // 23
  'Created At',              // 24
  'QR Pass Drive Link',      // 25
  'Goodies T-Shirt',         // 26
  'Goodies T-Shirt Size',    // 27
  'Goodies Badge',           // 28  ← was missing before
  'Goodies Badge Quantity',  // 29
  'Goodies Wristband',       // 30  ← was missing before
  'Goodies Wristband Quantity', // 31
  'Goodies Cap',             // 32  ← was missing before
  'Goodies Cap Quantity',    // 33
]

function authorizeSetup() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID)
  const folder = DriveApp.getFolderById(PICTURES_FOLDER_ID)
  const testFile = folder.createFile(
    Utilities.newBlob('authorization test', 'text/plain', 'juman-co-authorization-test.txt')
  )
  testFile.setTrashed(true)
  return {
    spreadsheetName: spreadsheet.getName(),
    folderName: folder.getName(),
  }
}

function doPost(e) {
  try {
    const sheet = getReservationsSheet()
    const data = JSON.parse(e.postData.contents)

    // Save picture and QR — log errors so they show up in Apps Script logs
    const pictureResult = savePicture(data)
    const qrPassResult = saveQrPass(data)

    if (pictureResult.error) {
      Logger.log('Picture upload error: ' + pictureResult.error)
    }
    if (qrPassResult.error) {
      Logger.log('QR pass upload error: ' + qrPassResult.error)
    }

    // appendRow order must match RESERVATION_HEADERS exactly (33 columns)
    sheet.appendRow([
      new Date(),                                                           // 1  Received At
      data.id || '',                                                        // 2  Reservation ID
      data.privacyCertified ? 'Yes' : 'No',                                // 3  Privacy Certified
      data.fullName || '',                                                  // 4  Full Name
      data.wellbeing || '',                                                 // 5  Holding Up Lately
      data.age || '',                                                       // 6  Age
      data.phone || '',                                                     // 7  WhatsApp Phone
      data.email || '',                                                     // 8  Email
      data.facebookLink || '',                                              // 9  Facebook Link
      data.funFact || '',                                                   // 10 Fun Fact
      data.pictureName || '',                                               // 11 Picture Name
      pictureResult.url || pictureResult.error || '',                       // 12 Picture Drive Link
      data.lc || '',                                                        // 13 LC
      data.department || '',                                                // 14 Department
      data.position || '',                                                  // 15 Current Position
      data.excitement || '',                                                // 16 Excitement Rating
      data.attendedNationalConference || '',                                // 17 Attended National Conference
      data.differently || '',                                               // 18 Done Differently
      data.expectations || '',                                              // 19 Adventure Expectations
      data.allergies || '',                                                 // 20 Food Allergies
      data.comfort || '',                                                   // 21 Comfort Notes
      data.comingFor || '',                                                 // 22 Coming For
      data.feeAgreement ? 'Yes' : 'No',                                    // 23 Fee Agreement
      data.createdAt || '',                                                 // 24 Created At
      qrPassResult.url || qrPassResult.error || '',                        // 25 QR Pass Drive Link
      data.goodieTshirt === 'Yes' ? 'Yes' : 'No',                         // 26 Goodies T-Shirt
      data.goodieTshirtSize || '',                                          // 27 Goodies T-Shirt Size
      data.goodieBadge === 'Yes' ? 'Yes' : 'No',                          // 28 Goodies Badge
      data.goodieBadge === 'Yes' ? data.goodieBadgeQuantity || '' : '',    // 29 Goodies Badge Quantity
      data.goodieWristband === 'Yes' ? 'Yes' : 'No',                      // 30 Goodies Wristband
      data.goodieWristband === 'Yes' ? data.goodieWristbandQuantity || '' : '', // 31 Goodies Wristband Quantity
      data.goodieCap === 'Yes' ? 'Yes' : 'No',                            // 32 Goodies Cap
      data.goodieCap === 'Yes' ? data.goodieCapQuantity || '' : '',        // 33 Goodies Cap Quantity
    ])

    return jsonResponse({
      success: true,
      pictureUploaded: Boolean(pictureResult.url),
      pictureError: pictureResult.error || '',
      qrPassUploaded: Boolean(qrPassResult.url),
      qrPassError: qrPassResult.error || '',
    })
  } catch (error) {
    Logger.log('doPost error: ' + String(error && error.message ? error.message : error))
    return jsonResponse({
      success: false,
      error: String(error && error.message ? error.message : error),
    })
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'stats') {
    try {
      return jsonResponse(getRegistrationStats())
    } catch (error) {
      return jsonResponse({
        success: false,
        error: String(error && error.message ? error.message : error),
      })
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

  status.effectiveUser = Session.getEffectiveUser().getEmail()
  status.activeUser = Session.getActiveUser().getEmail()

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

function getRegistrationStats() {
  const lcList = [
    'LC Babez', 'LC Benak', 'LC Bejaia', 'LC Blida',
    'LC Constantine', 'LC Tlemen', 'LC Oran',
  ]
  const counts = {}
  const sheet = getReservationsSheet()
  const values = sheet.getDataRange().getValues()

  lcList.forEach(function (lc) { counts[lc] = 0 })

  // Skip header row (index 0), column 13 = LC (index 12)
  const rows = values.slice(1).filter(function (row) {
    return row[1] || row[3] || row[12]
  })

  rows.forEach(function (row) {
    const lc = String(row[12] || '').trim()
    if (lc) counts[lc] = (counts[lc] || 0) + 1
  })

  const ranked = lcList
    .map(function (lc, order) {
      return { lc: lc, order: order, count: counts[lc] || 0 }
    })
    .sort(function (a, b) {
      return b.count - a.count || a.order - b.order
    })

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
    sheet.appendRow(RESERVATION_HEADERS)
  } else {
    // Update headers if they don't match (handles adding new columns)
    const currentLastCol = sheet.getLastColumn()
    const neededCols = RESERVATION_HEADERS.length

    // Expand range check to cover all needed headers
    const checkCols = Math.max(currentLastCol, neededCols)
    const headerRange = sheet.getRange(1, 1, 1, checkCols)
    const currentHeaders = headerRange.getValues()[0]

    RESERVATION_HEADERS.forEach(function (header, index) {
      if (currentHeaders[index] !== header) {
        sheet.getRange(1, index + 1).setValue(header)
      }
    })
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
    const file = folder.createFile(
      Utilities.newBlob(bytes, contentType, (data.id || 'unknown') + '-' + safeName)
    )
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
    return { url: file.getUrl(), error: '' }
  } catch (error) {
    return {
      url: '',
      error: 'Drive upload failed: ' + String(error && error.message ? error.message : error),
    }
  }
}

function saveQrPass(data) {
  if (!data.qrCodeDataUrl || !data.id) {
    return { url: '', error: '' }
  }

  const parts = data.qrCodeDataUrl.split(',')
  if (parts.length < 2) {
    return { url: '', error: 'Invalid QR pass data.' }
  }

  try {
    const bytes = Utilities.base64Decode(parts[1])
    const folder = getPicturesFolder()
    const file = folder.createFile(
      Utilities.newBlob(bytes, 'image/png', data.id + '-qr-pass.png')
    )
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
    return { url: file.getUrl(), error: '' }
  } catch (error) {
    return {
      url: '',
      error: 'QR pass upload failed: ' + String(error && error.message ? error.message : error),
    }
  }
}

function getPicturesFolder() {
  return DriveApp.getFolderById(PICTURES_FOLDER_ID)
}

function testDriveWrite(folder) {
  const testFile = folder.createFile(
    Utilities.newBlob('write test', 'text/plain', 'juman-co-write-test.txt')
  )
  testFile.setTrashed(true)
  return true
}