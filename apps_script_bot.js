/*************************************
 *  1. Setup your constants here
 *************************************/
var TELEGRAM_TOKEN = '7643307936:AAGaCAYGCLHNg08sebJFVRWKMt2DoPEG4Kc';
var TELEGRAM_API_URL = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/';
var SECRET_CODE = 'secret';    // Replace with the exact code you expect
var FILE_ID = '1s_iXW-wHUqB08Gokyxg907Ax9xQ98wKm';   

/*************************************
 *  2. Deploy as Web App and run startBot()
 *************************************/

// Check current webhook status
function getWebhookInfo() {
  var url = TELEGRAM_API_URL + 'getWebhookInfo';
  var response = UrlFetchApp.fetch(url);
  var info = JSON.parse(response.getContentText());
  logToSheet('Current webhook info: ' + JSON.stringify(info));
  return info;
}

function startBot() {
  var webhookUrl = TELEGRAM_API_URL + 'setWebhook?url=' + 
    'https://script.google.com/macros/s/AKfycbyipKJUWkGPUi4XacVI_a4KcS3rbHS3XTdyH5JLe2fr-NEtaOt3vvABG5OUp2_VZCU/exec';
  var response = UrlFetchApp.fetch(webhookUrl);
  logToSheet('Webhook set: ' + response.getContentText());
}

// Handle GET requests to the web app
function doGet(e) {
  return ContentService.createTextOutput('Bot is running');
}

// Call this if you want to remove the webhook
function stopBot() {
  var url = TELEGRAM_API_URL + 'deleteWebhook';
  var response = UrlFetchApp.fetch(url);
  logToSheet('Webhook removed: ' + response.getContentText());
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var message = contents.message;
  
  if (!message) {
    return;
  }

  var chatId = message.chat.id;
  var text = message.text || '';

  if (text === '/start') {
    sendMessage(chatId, 'Добро пожаловать! Пожалуйста, введите код подарка, чтобы получить ваш файл.');
    return;
  }

  if (text.toLowerCase() === SECRET_CODE.toLowerCase()) {
    sendDriveFile(chatId);
  } else {
    sendMessage(chatId, '❌ Неверный код. Попробуйте еще раз или используйте /start для перезапуска.');
  }
}

// Function to send a message to the user
function sendMessage(chatId, text) {
  try {
    var url = TELEGRAM_API_URL + 'sendMessage';
    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify({
        'chat_id': chatId,
        'text': text
      })
    };
    UrlFetchApp.fetch(url, options);
    logToSheet('Message sent to ' + chatId + ': ' + text);
  } catch (error) {
    logToSheet('Error in sendMessage: ' + error.toString());
  }
}

// Function to send the Google Drive file
function sendDriveFile(chatId) {
  try {
    logToSheet('Starting file send process for chat ID: ' + chatId);
    logToSheet('Attempting to get file with ID: ' + FILE_ID);
    
    var file = DriveApp.getFileById(FILE_ID);
    logToSheet('File found: ' + file.getName() + ' (' + file.getSize() + ' bytes)');
    
    var fileBlob = file.getBlob();
    logToSheet('Blob created: ' + fileBlob.getContentType() + ', size: ' + fileBlob.getBytes().length);
    
    var url = TELEGRAM_API_URL + 'sendDocument';
    logToSheet('Sending to Telegram URL: ' + url);
    
    var formData = {
      'method': 'post',
      'payload': {
        'chat_id': String(chatId),
        'document': fileBlob,
        'caption': 'Вот ваш файл!'
      },
      'muteHttpExceptions': true
    };
    
    logToSheet('Sending request to Telegram with chat_id type: ' + typeof String(chatId));
    var response = UrlFetchApp.fetch(url, formData);
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();
    logToSheet('Telegram response code: ' + responseCode);
    logToSheet('Telegram response: ' + responseText);

    if (responseCode !== 200) {
      throw new Error('Telegram API returned code ' + responseCode + ': ' + responseText);
    }

    logToSheet('File sent successfully to ' + chatId);
  } catch (error) {
    logToSheet('DETAILED ERROR in sendDriveFile:');
    logToSheet('Error name: ' + error.name);
    logToSheet('Error message: ' + error.message);
    logToSheet('Error stack: ' + error.stack);
    sendMessage(chatId, 'Извините, произошла ошибка при отправке файла. Пожалуйста, попробуйте позже.');
  }
}

// Helper function to log events to a spreadsheet
function logToSheet(message) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([new Date(), message]);
  } catch (error) {
    Logger.log('Error logging to sheet: ' + error.toString() + '. Original message: ' + message);
  }
}
