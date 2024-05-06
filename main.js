const { app, BrowserWindow , Menu,MenuItem} = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const { ipcMain } = require('electron');
const { ipcRenderer, remote } = require('electron');
const fs = require('fs');
const XLSX = require('xlsx');

let backendProcess;




app.on('ready', () => {

    createWindow();

});


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false// Add this line
        }
    });
    win.loadFile('src/Views/ListProject.html');
   /* window.ipcRenderer = ipcRenderer;
    window.XLSX = remote.require('xlsx');
    ipcMain.on('fileSelected', (event, filePath) => {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        win.webContents.send('fileData', jsonData);
    });*/


    /*win.on('closed', () => {
        // Detener el proceso del backend cuando la ventana se cierre
        if (backendProcess) {
            backendProcess.kill();
        }
    });*/

}
