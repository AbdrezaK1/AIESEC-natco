const SHEET_NAME = 'Reservations'
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
    const sheet = getReservationsSheet()
    const data = JSON.parse(e.postData.contents)
    const pictureResult = savePicture(data)

    sheet.appendRow([
      new Date(),
      data.id || '',
      data.privacyCertified ? 'Yes' : 'No',
      data.fullName || '',
      data.wellbeing || '',
      data.age || '',
      data.phone || '',
      data.email || '',
      data.facebookLink || '',
      data.funFact || '',
      data.pictureName || '',
      pictureResult.url || pictureResult.error || '',
      data.lc || '',
      data.department || '',
      data.position || '',
      data.excitement || '',
      data.attendedNationalConference || '',
      data.differently || '',
      data.expectations || '',
      data.allergies || '',
      data.comfort || '',
      data.comingFor || '',
      data.feeAgreement ? 'Yes' : 'No',
      data.createdAt || '',
    ])

    return jsonResponse({
      success: true,
      pictureUploaded: Boolean(pictureResult.url),
      pictureError: pictureResult.error || '',
    })
  } catch (error) {
    return jsonResponse({ success: false, error: String(error && error.message ? error.message : error) })
  }
}

function doGet() {
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
      'Received At',
      'Reservation ID',
      'Privacy Certified',
      'Full Name',
      'Holding Up Lately',
      'Age',
      'WhatsApp Phone',
      'Email',
      'Facebook Link',
      'Fun Fact',
      'Picture Name',
      'Picture Drive Link',
      'LC',
      'Department',
      'Current Position',
      'Excitement Rating',
      'Attended National Conference',
      'Done Differently',
      'Adventure Expectations',
      'Food Allergies',
      'Comfort Notes',
      'Coming For',
      'Fee Agreement',
      'Created At',
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

    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
    return { url: file.getUrl(), error: '' }
  } catch (error) {
    return { url: '', error: 'Drive upload failed: ' + String(error && error.message ? error.message : error) }
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
