const { app, BrowserWindow , Menu,MenuItem} = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const { ipcMain } = require('electron');
const { ipcRenderer, remote } = require('electron');
const fs = require('fs');
const XLSX = require('xlsx');
require('dotenv').config();

let backendProcess;




app.on('ready', () => {

    createWindow();

});

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false// Add this line
        }
    });
    win.loadFile('src/Views/ListProject.html');
    global.mainWindow = mainWindow;

    ipcMain.on('reload-main-window', () => {
        if (mainWindow) {
            mainWindow.reload();
        }
    });

}
