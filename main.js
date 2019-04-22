const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
//const fs = require('fs')

//Global ref variable
let win
let optionsWin

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

  //win.webContents.openDevTools()
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', ()=> {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('show-options', function() {
  optionsWin.show();
})