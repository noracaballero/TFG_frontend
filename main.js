const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backendProcess;

app.on('ready', () => {
    // Ruta al archivo de tu aplicación Java
    const javaFilePath = 'C:\\Users\\norac\\Desktop\\automation\\build\\libs\\automation-0.0.1-SNAPSHOT.jar';

    // Construye la ruta al directorio de la aplicación Java
    const javaDirectory = path.dirname(javaFilePath);

    // Construye el comando para ejecutar la aplicación Java
    const javaCommand = 'java';
    const javaArgs = ['-jar', javaFilePath];

    // Iniciar el proceso del backend
    backendProcess = spawn(javaCommand, javaArgs);

    backendProcess.stdout.on('data', (data) => {
        console.log(`Backend stdout: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`Backend stderr: ${data}`);
    });

    // Crear la ventana principal de tu aplicación Electron
    createWindow();
});

/*app.on('will-quit', () => {
    // Detener el proceso del backend cuando la aplicación se cierra
    if (backendProcess) {
        backendProcess.kill();
    }
});*/

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadFile('InitDadesProject.html');

    win.on('closed', () => {
        // Detener el proceso del backend cuando la ventana se cierre
        if (backendProcess) {
            backendProcess.kill();
        }
    });
}
