const { app, BrowserWindow, screen, ipcMain } = require('electron')
const url = require('url');
const path = require('path');
const fs = require('fs');
const { localStorage } = require('electron-browser-storage');

let win;
let win2;

const videoPath = path.join(__dirname, '/Videos');
const backgroundsPath = path.join(__dirname, '/Fondos');
const bannersPath = path.join(__dirname, '/Banners');
const playersPath = path.join(__dirname, '/Jugadores');
var readInterval;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

  readInterval = setInterval(async () => {
    var update = await localStorage.getItem("update");
    if(update) {
      switch(update) {
        case "": break;
        case "video":
          fs.readdir(videoPath, (err, files) => {
            localStorage.setItem("videoFiles", JSON.stringify(files.map(file => path.join(__dirname, '/Videos/' + file).replaceAll("\\", "\/"))));
          });
          localStorage.setItem("update", "videosUpdated");
          break;
        case "background":
          fs.readdir(backgroundsPath, (err, files) => {
            localStorage.setItem("backgroundFiles", JSON.stringify(files.map(file => path.join(__dirname, '/Fondos/' + file).replaceAll("\\", "\/"))));
          });
          localStorage.setItem("update", "backgroundsUpdated");
          break;
        case "banner":
          fs.readdir(bannersPath, (err, files) => {
            localStorage.setItem("bannerFiles", JSON.stringify(files.map(file => path.join(__dirname, '/Banners/' + file).replaceAll("\\", "\/"))));
          });
          localStorage.setItem("update", "bannersUpdated");
          break;
        case "playerImg":
          fs.readdir(playersPath, (err, files) => {
            localStorage.setItem("playerImgFiles", JSON.stringify(files.map(file => path.join(__dirname, '/Jugadores/' + file).replaceAll("\\", "\/"))));
          });
          localStorage.setItem("update", "playersImgUpdated");
          break;
      }
    }
  }, 500);

function createWindow () {
  



  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  win = new BrowserWindow({
    width: width, 
    height: height,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`,
    autoHideMenuBar: true,

  })

  win.loadURL(`file://${__dirname}/dist/marcador-tenis/index.html`);

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })

   // Create the browser window.
    win2 = new BrowserWindow({
      width: width, 
      height: height,
      backgroundColor: '#ffffff',
      icon: `file://${__dirname}/dist/assets/logo.png`,
      autoHideMenuBar: true
    })
   
  const urlScreen = url.format({
    pathname: path.join(__dirname, '/dist/marcador-tenis/index.html'),
    protocol: 'file:',
    slashes: true,
    hash: '/screen',
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    },
  }
  );

  win2.loadURL(urlScreen);

  // Event when the window is closed.
  win2.on('closed', function () {
    win2 = null
  })
}


// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  clearInterval(readInterval);
  app.quit()
  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})